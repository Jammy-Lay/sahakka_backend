const task = require("../../services/user/task");
const workspace = require("../../services/user/workspace");
const team = require("../../services/user/team");

exports.getTasksByTeam = async (req, res) => {
  try {
    const { team_id, workspace_id } = req.params;

    const rows = await task.getTasksByTeam(team_id, workspace_id);
    const rowWorkspace = await workspace.findWorkspace(workspace_id);
    const rowTeam = await team.findTeam(team_id);

    return res.json({
      result: true,
      message: "Get Task Successfully",
      data: { workspace: rowWorkspace, team: rowTeam, tasks: rows },
    });
  } catch (error) {
    console.log(error);
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
      req.body,
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
      req.body,
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
    return res.json({
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
