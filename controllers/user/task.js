const task = require("../../services/user/task");
const workspace = require("../../services/user/workspace");
const team = require("../../services/user/team");

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

    const row = await task.findTaskById(result);

    return res.json({
      result: true,
      message: "Task created successfully",
      data: row[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { task_id, workspace_id } = req.params;

    await task.updateTask(
      task_id,
      req.validData,
      req.workspaceRole,
      workspace_id,
      req.user.id,
    );

    const row = await task.findTaskById(task_id);

    return res.json({
      result: true,
      message: "Task created successfully",
      data: row[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: error.message,
    });
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

exports.deleteTask = async (req, res) => {
  try {
    const { workspace_id, team_id, task_id } = req.params;

    await task.deleteTask(workspace_id, team_id, task_id, req.user.id);

    return res.json({
      result: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
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
