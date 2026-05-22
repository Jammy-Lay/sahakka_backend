const team = require("../../services/user/team");
const workspace = require("../../services/user/workspace");

exports.createTeam = async (req, res) => {
  try {
    const { workspace_id } = req.params;

    const team_id = await team.createTeam(
      workspace_id,
      req.body.title,
      req.body.description,
    );
    await team.addTeamMember(team_id, req.user.id);
    await team.addTeamSection(team_id);

    const row = await workspace.findWorkspaceWithTeam(
      team_id,
      workspace_id,
      req.user,
    );

    return res.json({
      result: true,
      message: "Create Team Successfully",
      data: row,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: error.message,
    });
  }
};

exports.getSectionsByTeam = async (req, res) => {
  try {
    const { team_id } = req.params;

    const rows = await team.getSectionsByTeam(team_id);

    return res.json({
      result: true,
      message: "Get Sections Successfully",
      data: rows,
    });
  } catch (err) {
    return res.status(500).json({
      result: false,
      message: err.message,
    });
  }
};

exports.getTeamsByWorkspace = async (req, res) => {
  try {
    const { workspace_id } = req.params;
    const user_id = req.user.id;

    const data = await team.getTeamsByWorkspace(workspace_id, user_id);

    return res.json({
      result: true,
      message: "Get teams successfully",
      data,
    });
  } catch (err) {
    return res.status(400).json({
      result: false,
      message: err.message,
    });
  }
};

exports.getTeamActivityById = async (req, res) => {
  try {
    const { team_id } = req.params;
    const rows = await team.getTeamActivityById(team_id);
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

exports.deleteTeam = async (req, res) => {
  try {
    const { team_id } = req.params;
    await team.deleteTeam(team_id);
    return res.json({
      result: true,
      message: "Delete Team Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { workspace_id, team_id } = req.params;
    await team.updateTeam(req.body.title, req.body.description, team_id);
    const row = await workspace.findWorkspaceWithTeam(team_id, workspace_id, req.user);
    return res.json({
      result: true,
      message: "Delete Team Successfully",
      data: row,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};
