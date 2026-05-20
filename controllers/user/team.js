const team = require("../../services/user/team");
const workspace = require("../../services/user/workspace");

exports.createTeam = async (req, res) => {
  try {
    let workspace_id = req.params.workspace_id;

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

exports.getTeamsByWorkspace = async (req, res) => {
  try {
    const { workspace_id } = req.params;

    const rows = await team.getTeamsByWorkspace(workspace_id);

    return res.json({
      result: true,
      message: "Get Teams Successfully",
      data: rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: error.message,
    });
  }
};
