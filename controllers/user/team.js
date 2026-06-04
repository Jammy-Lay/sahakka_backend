const team = require("../../services/user/team");
const workspace = require("../../services/user/workspace");

exports.createTeam = async (req, res) => {
  try {
    const { workspace_id } = req.params;

    const team_id = await team.createTeam(
      workspace_id,
      req.validData.title,
      req.validData.description,
    );
    await team.addTeamMember(team_id, req.user.id);
    await team.addTeamSection(team_id);

    const row = await workspace.findWorkspaceWithTeam(
      workspace_id,
      team_id,
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

    const rows = await team.getTeamsByWorkspace(workspace_id, user_id);
    const row = await workspace.findWorkspace(workspace_id);

    return res.json({
      result: true,
      message: "Get teams successfully",
      data: { workspace: row, team: rows },
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
      message: "Get Team Activity Successfully",
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
    const { team_id, workspace_id } = req.params;
    await team.deleteTeam(team_id, workspace_id);
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

    await team.updateTeam(
      req.validData.title,
      req.validData.description,
      team_id,
    );

    const row = await workspace.findWorkspaceWithTeam(
      workspace_id,
      team_id,
      req.user,
    );

    return res.json({
      result: true,
      message: "Update Team Successfully",
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

exports.removeTeamMember = async (req, res) => {
  try {
    const { workspace_id, team_id, user_id } = req.params;

    await team.removeTeamMember(workspace_id, team_id, user_id, req.user.id);

    return res.json({
      result: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const { workspace_id, team_id } = req.params;

    const rows = await team.getTeamMembers(workspace_id, team_id);

    return res.json({
      result: true,
      message: "Get Team member Successfully",
      data: rows,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
