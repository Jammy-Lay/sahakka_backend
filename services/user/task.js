const task = require("../../models/user/task");
const team = require("../../models/user/team");
const users = require("../../models/users");
const workspace = require("../../models/user/workspace");
const { sendTaskAssignByEmail } = require("../mail/mailService");

exports.getTasksByTeam = async (team_id, workspace_id, status) => {
  const rows = await task.getTasksByTeam(team_id, workspace_id, status);

  if (rows.length === 0) {
    return [];
  }

  return rows.map((item) => ({
    id: item.id,
    team_id: item.team_id,
    title: item.title,
    description: item.description,
    type: item.type,
    status: item.status,
    priority: item.priority,
    created_at: item.created_at,
    start_date: item.start_date,
    end_date: item.end_date,

    created_by: {
      user_id: item.created_by_id,
      name: item.created_by_name,
      avatar: item.created_by_avatar,
    },

    assigned_by: {
      user_id: item.assigned_by_id,
      name: item.assigned_by_name,
      avatar: item.assigned_by_avatar,
    },

    assigned_to: {
      user_id: item.assigned_to_id,
      name: item.assigned_to_name,
      avatar: item.assigned_to_avatar,
    },
  }));
};

exports.createTask = async (
  team_id,
  body,
  workspaceRole,
  workspace_id,
  user_id,
) => {
  // validate date
  if (
    body.start_date != null &&
    body.end_date != null &&
    new Date(body.start_date) > new Date(body.end_date)
  ) {
    throw new Error("Start date cannot be after end date");
  }

  let assigned_to = null;
  let assigned_by = null;

  // role permission
  if (workspaceRole === "owner" || workspaceRole === "moderator") {
    assigned_to = body.assigned_to ?? null;
    assigned_by = assigned_to ? user_id : null;
  } else {
    if (body.assigned_to != null && body.assigned_to !== user_id) {
      throw new Error("You are not allowed to assign task to other users");
    }

    assigned_to = user_id;
    assigned_by = user_id;
  }

  // validate assigned user
  if (assigned_to != null) {
    const member = await team.checkTeamMember(assigned_to, team_id);

    if (member.length === 0) {
      throw new Error("User is not in this team");
    }

    const target = await workspace.checkWorkspaceMember(
      assigned_to,
      workspace_id,
    );

    if (
      workspaceRole === "moderator" &&
      target.length > 0 &&
      assigned_to !== user_id
    ) {
      const targetRole = target[0].role;
      if (targetRole === "owner") {
        throw new Error("Moderator cannot assign tasks to owner");
      }
      if (targetRole === "moderator") {
        throw new Error("Moderator cannot assign tasks to another moderator");
      }
    }
  }

  // create task
  const task_id = await task.createTask(
    team_id,
    {
      ...body,
      assigned_to,
      assigned_by,
    },
    user_id,
  );

  // create activity
  await task.createTaskActivity(task_id, user_id, "create", "created the task");

  await team.createTeamActivity(
    team_id,
    user_id,
    "create",
    `created task ${body.title}`,
  );

  // assignment activity + email
  if (assigned_to != null) {
    const selfAssign = assigned_to === user_id;

    let messageTask = "";
    let messageTeam = "";

    if (selfAssign) {
      messageTask = "self-assigned the task";

      messageTeam = `self-assigned task ${body.title}`;
    } else {
      const assignedUser = await users.findById(assigned_to);

      const assigner = await users.findById(user_id);

      const data = await workspace.findWorkspaceWithTeam(workspace_id, team_id);

      messageTask = `assigned task to ${assignedUser[0].name}`;

      messageTeam = `assigned task ${body.title} to ${assignedUser[0].name}`;

      await sendTaskAssignByEmail(
        assignedUser[0].email,
        data.workspace_name,
        data.title,
        body.title,
        assigner[0].name,
        assigner[0].avatar,
        workspace_id,
        team_id,
      );
    }

    await task.createTaskActivity(task_id, user_id, "assign", messageTask);

    await team.createTeamActivity(team_id, user_id, "assign", messageTeam);
  }

  return {
    task_id,
  };
};

exports.updateTask = async (
  task_id,
  body,
  workspaceRole,
  workspace_id,
  team_id,
  user_id,
) => {
  const row = await task.findTaskById(task_id);

  if (row.length === 0) {
    throw new Error("Task not found");
  }

  const current = row[0];

  const checkTaskInTeam = await task.checkTaskInTeam(task_id, team_id);

  if (checkTaskInTeam.length === 0) {
    throw new Error("Task is not in this team");
  }

  const fullyLockedStatuses = ["submitted", "approved"];
  if (fullyLockedStatuses.includes(current.status)) {
    throw new Error(`Cannot update task when task is ${current.status}`);
  }

  if (
    current.status === "rejected" &&
    "status" in body &&
    body.status !== current.status
  ) {
    throw new Error("Cannot change status when task is rejected");
  }

  if (body.start_date && body.end_date && body.start_date > body.end_date) {
    throw new Error("Start date cannot be after end date");
  }

  let assigned_to = current.assigned_to_id;
  let assigned_by = current.assigned_by_id;

  if (workspaceRole === "owner" || workspaceRole === "moderator") {
    if ("assigned_to" in body) {
      assigned_to = body.assigned_to;
      assigned_by = assigned_to ? user_id : null;
    }
  } else {
    if ("assigned_to" in body) {
      if (body.assigned_to !== null && body.assigned_to !== user_id) {
        throw new Error("You are not allowed to assign task to other users");
      }
      assigned_to = body.assigned_to;
      assigned_by = assigned_to ? user_id : null;
    }
  }

  if ("assigned_to" in body && assigned_to != null) {
    const member = await team.checkTeamMember(assigned_to, team_id);

    if (member.length === 0) {
      throw new Error("User is not in this team");
    }

    const target = await workspace.checkWorkspaceMember(
      assigned_to,
      workspace_id,
    );

    if (
      workspaceRole === "moderator" &&
      target.length &&
      assigned_to !== user_id
    ) {
      const targetRole = target[0].role;
      if (targetRole === "owner") {
        throw new Error("Moderator cannot assign tasks to owner");
      }
      if (targetRole === "moderator") {
        throw new Error("Moderator cannot assign tasks to another moderator");
      }
    }
  }

  await task.updateTask(task_id, {
    title: body.title ?? current.title,
    description: body.description ?? current.description,
    type: body.type ?? current.type,
    status: body.status ?? current.status,
    priority: body.priority ?? current.priority,
    assigned_to,
    assigned_by,
    start_date:
      body.start_date !== undefined ? body.start_date : current.start_date,
    end_date: body.end_date !== undefined ? body.end_date : current.end_date,
  });

  if (assigned_to !== current.assigned_to_id && assigned_to != null) {
    const self = assigned_to === user_id;
    let messageTask = "";
    let messageTeam = "";

    if (self) {
      messageTask = "self-assigned the task";
      messageTeam = `self-assigned task ${current.title}`;
    } else {
      const assigned = await users.findById(assigned_to);
      const assigner = await users.findById(user_id);
      const data = await workspace.findWorkspaceWithTeam(workspace_id, team_id);

      messageTask = `assigned task to ${assigned[0].name}`;
      messageTeam = `assigned task ${current.title} to ${assigned[0].name}`;

      await sendTaskAssignByEmail(
        assigned[0].email,
        data.workspace_name,
        data.title,
        current.title,
        assigner[0].name,
        assigner[0].avatar,
        workspace_id,
        team_id,
      );
    }

    await task.createTaskActivity(task_id, user_id, "assign", messageTask);
    await team.createTeamActivity(team_id, user_id, "assign", messageTeam);
  }

  if (assigned_to === null && current.assigned_to_id !== null) {
    const previouslyAssigned = await users.findById(current.assigned_to_id);

    await task.createTaskActivity(
      task_id,
      user_id,
      "unassign",
      `unassigned ${previouslyAssigned[0].name} from the task`,
    );
    
    await team.createTeamActivity(
      team_id,
      user_id,
      "unassign",
      `unassigned ${previouslyAssigned[0].name} from task ${current.title}`,
    );
  }

  if ("title" in body && body.title && body.title !== current.title) {
    await task.createTaskActivity(
      task_id,
      user_id,
      "update",
      `renamed task ${current.title} to ${body.title}`,
    );
    await team.createTeamActivity(
      team_id,
      user_id,
      "update",
      `renamed task ${current.title} to ${body.title}`,
    );
  }

  return true;
};

exports.findTaskById = async (task_id) => {
  const row = await task.findTaskById(task_id);

  if (row.length === 0) return [];

  const item = row[0];

  return [
    {
      id: item.id,
      team_id: item.team_id,
      title: item.title,
      description: item.description,
      type: item.type,
      status: item.status,
      priority: item.priority,
      created_at: item.created_at,
      start_date: item.start_date,
      end_date: item.end_date,

      created_by: {
        user_id: item.created_by_id,
        name: item.created_by_name,
        avatar: item.created_by_avatar,
      },

      assigned_to: {
        user_id: item.assigned_to_id,
        name: item.assigned_to_name,
        avatar: item.assigned_to_avatar,
      },

      assigned_by: {
        user_id: item.assigned_by_id,
        name: item.assigned_by_name,
        avatar: item.assigned_by_avatar,
      },
    },
  ];
};

exports.getTaskActivityById = async (task_id, team_id) => {
  const checkTask = await task.findTaskById(task_id);
  if (checkTask.length === 0) {
    throw new Error("Task not found");
  }

  const checkTaskInTeam = await task.checkTaskInTeam(task_id, team_id);
  if (checkTaskInTeam.length === 0) {
    throw new Error("Task is not in that team");
  }

  const rows = await task.getTaskActivityById(task_id);

  const data = rows.map((item) => ({
    id: item.id,
    task_id: item.task_id,
    action: item.action,
    message: item.message,
    created_at: item.created_at,

    created_by: {
      user_id: item.created_by_id,
      name: item.created_by_name,
      avatar: item.created_by_avatar,
    },
  }));

  return data;
};

exports.createTaskActivity = async (task_id, user_id, action, message) => {
  const row = await task.createTaskActivity(task_id, user_id, action, message);
  return row;
};

exports.createDefaultTask = async (team_id, user_id) => {
  await task.createDefaultTask(team_id, user_id);
};

exports.deleteTask = async (workspace_id, team_id, task_id, user_id) => {
  const row = await task.findTaskById(task_id);

  if (row.length === 0) {
    throw new Error("Task not found");
  }

  const current = row[0];

  const checkTaskInTeam = await task.checkTaskInTeam(task_id, team_id);

  if (checkTaskInTeam.length === 0) {
    throw new Error("Task is not in this team");
  }

  await team.createTeamActivity(
    team_id,
    user_id,
    "delete",
    `deleted task ${current.title}`,
  );

  await task.deleteTask(task_id);

  return true;
};

exports.getMyTaskSummary = async (workspace_id, team_id, user_id) => {
  const data = await task.getMyTaskSummary(workspace_id, team_id, user_id);

  return {
    total_tasks: Number(data.total_tasks),

    status: {
      todo: Number(data.todo),
      in_progress: Number(data.in_progress),
      submitted: Number(data.submitted),
      approved: Number(data.approved),
      rejected: Number(data.rejected),
    },

    priority: {
      urgent: Number(data.urgent),
      high: Number(data.high),
      medium: Number(data.medium),
      low: Number(data.low),
    },
  };
};

exports.getMyTasks = async (workspace_id, team_id, user_id, status) => {
  const rows = await task.getMyTasks(workspace_id, team_id, user_id, status);

  if (rows.length === 0) {
    return [];
  }

  return rows.map((item) => ({
    id: item.id,
    team_id: item.team_id,
    title: item.title,
    description: item.description,
    type: item.type,
    status: item.status,
    priority: item.priority,
    created_at: item.created_at,
    start_date: item.start_date,
    end_date: item.end_date,

    created_by: {
      user_id: item.created_by_id,
      name: item.created_by_name,
      avatar: item.created_by_avatar,
    },

    assigned_to: {
      user_id: item.assigned_to_id,
      name: item.assigned_to_name,
      avatar: item.assigned_to_avatar,
    },

    assigned_by: {
      user_id: item.assigned_by_id,
      name: item.assigned_by_name,
      avatar: item.assigned_by_avatar,
    },
  }));
};

exports.getTaskById = async (workspace_id, team_id, task_id) => {
  const rows = await task.getTaskById(workspace_id, team_id, task_id);

  if (rows.length === 0) {
    throw new Error("Task not found");
  }

  const item = rows[0];

  return {
    id: item.id,
    team_id: item.team_id,
    title: item.title,
    description: item.description,
    type: item.type,
    status: item.status,
    priority: item.priority,
    created_at: item.created_at,
    start_date: item.start_date,
    end_date: item.end_date,

    created_by: {
      user_id: item.created_by_id,
      name: item.created_by_name,
      avatar: item.created_by_avatar,
    },

    assigned_to: {
      user_id: item.assigned_to_id,
      name: item.assigned_to_name,
      avatar: item.assigned_to_avatar,
    },

    assigned_by: {
      user_id: item.assigned_by_id,
      name: item.assigned_by_name,
      avatar: item.assigned_by_avatar,
    },
  };
};
