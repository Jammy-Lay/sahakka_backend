const task = require("../../models/user/task");
const team = require("../../models/user/team");
const users = require("../../models/users");
const workspace = require("../../models/user/workspace");
const { sendTaskAssignByEmail } = require("../mail/mailService");

exports.getTasksByTeam = async (team_id, workspace_id) => {
  const rows = await task.getTasksByTeam(team_id, workspace_id);

  const data = rows.map((item) => ({
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
  }));

  return data;
};

exports.createTask = async (
  team_id,
  body,
  workspaceRole,
  workspace_id,
  user_id,
) => {
  if (body.start_date && body.end_date) {
    if (body.start_date > body.end_date) {
      throw new Error("Start date cannot be after end date");
    }
  }

  let assigned_to = null;

  if (workspaceRole === "owner" || workspaceRole === "moderator") {
    assigned_to = body.assigned_to || null;
  } else {
    if (body.assigned_to && body.assigned_to !== user_id) {
      throw new Error("You are not allowed to assign task to other users");
    }
    assigned_to = user_id;
  }

  if (assigned_to != null) {
    const check = await team.checkTeamMember(assigned_to, team_id);
    if (check.length === 0) {
      throw new Error("User is not in this team");
    }
  }

  const task_id = await task.createTask(
    team_id,
    {
      ...body,
      assigned_to,
    },
    user_id,
  );

  await task.createTaskActivity(task_id, user_id, "create", "created the task");

  await team.createTeamActivity(
    team_id,
    user_id,
    "create",
    `created task ${body.title}`,
  );

  if (assigned_to != null) {
    const isSelfAssign = assigned_to === user_id;

    let messageTask = "";
    let messageTeam = "";

    await task.updateStatus("in_progress", task_id);

    if (isSelfAssign) {
      messageTask = "self-assigned the task";
      messageTeam = `self-assigned task ${body.title}`;
    } else {
      const assignedUser = await users.findById(assigned_to);
      const assigner = await users.findById(user_id);

      const assignedName = assignedUser[0].name;

      messageTask = `assigned task to ${assignedName}`;
      messageTeam = `assigned task ${body.title} to ${assignedName}`;

      const data = await workspace.findWorkspaceWithTeam(workspace_id, team_id);

      await sendTaskAssignByEmail(
        assignedUser[0].email,
        data.workspace_name,
        data.title,
        body.title,
        assigner[0].name,
        assigner[0].avatar,
      );
    }

    await task.createTaskActivity(task_id, user_id, "assign", messageTask);

    await team.createTeamActivity(team_id, user_id, "assign", messageTeam);
  }

  return task_id;
};

exports.updateTask = async (
  task_id,
  body,
  workspaceRole,
  workspace_id,
  user_id,
) => {
  const row = await task.findTaskById(task_id);
  if (row.length === 0) throw new Error("Task not found");

  const current = row[0];

  let assigned_to = current.assigned_to_id;

  if (workspaceRole === "owner" || workspaceRole === "moderator") {
    if ("assigned_to" in body) {
      assigned_to = body.assigned_to;
    }
  } else {
    if ("assigned_to" in body && body.assigned_to !== user_id) {
      throw new Error("You are not allowed to assign task to other users");
    }
    assigned_to = user_id;
  }

  if (assigned_to != null) {
    const check = await team.checkTeamMember(assigned_to, current.team_id);
    if (check.length === 0) {
      throw new Error("User is not in this team");
    }
  }

  await task.updateTask(task_id, {
    ...body,
    assigned_to,
  });

  if (assigned_to !== current.assigned_to_id && assigned_to != null) {
    const isSelfAssign = assigned_to === user_id;

    let messageTask = "";
    let messageTeam = "";

    await task.updateStatus("in_progress", task_id);

    if (isSelfAssign) {
      messageTask = "self-assigned the task";
      messageTeam = `self-assigned task ${current.title}`;
    } else {
      const assignedUser = await users.findById(assigned_to);
      const assigner = await users.findById(user_id);

      const assignedName = assignedUser[0].name;

      messageTask = `assigned task to ${assignedName}`;
      messageTeam = `assigned task ${current.title} to ${assignedName}`;

      const data = await workspace.findWorkspaceWithTeam(
        workspace_id,
        current.team_id,
      );

      await sendTaskAssignByEmail(
        assignedUser[0].email,
        data.workspace_name,
        data.title,
        current.title,
        assigner[0].name,
        assigner[0].avatar,
      );
    }

    await task.createTaskActivity(task_id, user_id, "assign", messageTask);

    await team.createTeamActivity(
      current.team_id,
      user_id,
      "assign",
      messageTeam,
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
