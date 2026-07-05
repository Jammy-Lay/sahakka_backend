const task = require("../../services/user/task");
const workspace = require("../../services/user/workspace");
const team = require("../../services/user/team");
const { getIO } = require("../../configs/socket");

exports.getTasksByTeam = async (req, res) => {
  try {
    const { team_id, workspace_id } = req.params;
    const { status } = req.query;

    const rows = await task.getTasksByTeam(team_id, workspace_id, status);

    const rowWorkspace = await workspace.findWorkspace(workspace_id);
    const rowTeam = await team.findTeam(team_id);

    return res.json({
      result: true,
      message: "Get Task Successfully",
      data: {
        workspace: rowWorkspace,
        team: rowTeam,
        tasks: rows,
      },
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { task_id, workspace_id, team_id } = req.params;

    await task.updateTask(
      task_id,
      req.validData,
      req.workspaceRole,
      workspace_id,
      team_id,
      req.user.id,
    );

    const row = await task.findTaskById(task_id);
    const updatedTask = row[0];

    const io = getIO();
    const room = `workspace:${workspace_id}:team:${team_id}`;
    io.to(room).emit("task-updated", updatedTask);

    const members = await team.getTeamMembers(workspace_id, team_id);
    members.forEach((member) => {
      io.to(`user:${member.user_id}`).emit("task-updated", {
        workspace_id,
        team_id,
        task: updatedTask,
      });
    });

    // Send personal notification
    if (
      updatedTask.assigned_to?.user_id &&
      updatedTask.assigned_to.user_id !== req.user.id
    ) {
      io.to(`user:${updatedTask.assigned_to.user_id}`).emit(
        "task-assigned-to-you",
        {
          task: updatedTask,
          assigned_by: updatedTask.assigned_by,
        },
      );
    }

    return res.json({
      result: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(400).json({ result: false, message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { team_id, workspace_id } = req.params;

    const result = await task.createTask(
      team_id,
      req.validData,
      req.workspaceRole,
      workspace_id,
      req.user.id,
    );

    const row = await task.findTaskById(result.task_id);
    const newTask = row[0];

    const io = getIO();
    const room = `workspace:${workspace_id}:team:${team_id}`;
    io.to(room).emit("task-created", newTask);
    const members = await team.getTeamMembers(workspace_id, team_id);
    members.forEach((member) => {
      io.to(`user:${member.user_id}`).emit("task-created", {
        workspace_id,
        team_id,
        task: newTask,
      });
    });

    // Send personal notification
    if (
      newTask.assigned_to?.user_id &&
      newTask.assigned_to.user_id !== req.user.id
    ) {
      io.to(`user:${newTask.assigned_to.user_id}`).emit(
        "task-assigned-to-you",
        {
          task: newTask,
          assigned_by: newTask.assigned_by,
        },
      );
    }

    return res.json({
      result: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    return res.status(400).json({ result: false, message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { workspace_id, team_id, task_id } = req.params;

    await task.deleteTask(workspace_id, team_id, task_id, req.user.id);

    const io = getIO();
    const room = `workspace:${workspace_id}:team:${team_id}`;
    io.to(room).emit("task-deleted", { task_id: Number(task_id) });
    const members = await team.getTeamMembers(workspace_id, team_id);
    members.forEach((member) => {
      io.to(`user:${member.user_id}`).emit("task-deleted", {
        workspace_id,
        team_id,
        task_id: Number(task_id),
      });
    });

    return res.json({
      result: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({ result: false, message: error.message });
  }
};

exports.getTaskActivityById = async (req, res) => {
  try {
    const { task_id, team_id } = req.params;
    const rows = await task.getTaskActivityById(task_id, team_id);
    return res.json({
      result: true,
      message: "Get Task Activity Successfully",
      data: rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.getMyTaskSummary = async (req, res) => {
  try {
    const { workspace_id, team_id } = req.params;

    const row = await task.getMyTaskSummary(workspace_id, team_id, req.user.id);

    return res.json({
      result: true,
      message: "Get Task Summary successfully",
      data: row,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const { workspace_id, team_id } = req.params;
    const { status } = req.query;

    const rows = await task.getMyTasks(
      workspace_id,
      team_id,
      req.user.id,
      status,
    );

    return res.json({
      result: true,
      message: "Get My Tasks successfully",
      data: rows,
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { workspace_id, team_id, task_id } = req.params;

    const data = await task.getTaskById(workspace_id, team_id, task_id);

    return res.json({
      result: true,
      message: "Get Task Successfully",
      data,
    });
  } catch (error) {
    return res.status(404).json({
      result: false,
      message: error.message,
    });
  }
};
