const workspace = require("../../services/user/workspace");
const team = require("../../services/user/team");
exports.defaultWorkspace = async (req, res) => {
  try {
    let owner_id = req.user.id;
    const workspace_id = await workspace.createWorkspace(
      "My Workspace",
      owner_id,
    );

    let dataWorkspace = {
      workspace_id: workspace_id,
      user_id: owner_id,
      role: "owner",
    };

    await workspace.addWorkspaceMember(dataWorkspace);

    let dataTeam = {
      workspace_id: workspace_id,
      title: "My Team",
      description: "Teamwork",
    };

    const team_id = await team.defaultTeam(dataTeam);
    await team.addTeamMember(team_id, owner_id);
    await team.addTeamSection(team_id);

    const row = await workspace.findWorkspaceById(workspace_id);

    return res.json({
      result: true,
      message: "Create Workspace Successfully",
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

exports.createWorkspace = async (req, res) => {
  try {
    let name = req.body.name;
    let owner_id = req.user.id;
    const workspace_id = await workspace.createWorkspace(name, owner_id);

    let dataWorkspace = {
      workspace_id: Number(workspace_id),
      user_id: owner_id,
      role: "owner",
    };

    await workspace.addWorkspaceMember(dataWorkspace);

    let dataTeam = {
      workspace_id: Number(workspace_id),
      title: "My Team",
      description: "Teamwork",
    };

    const team_id = await team.defaultTeam(dataTeam);
    await team.addTeamMember(team_id, owner_id);
    await team.addTeamSection(team_id);

    const row = await workspace.findWorkspaceWithTeam(
      team_id,
      workspace_id,
      req.user,
    );

    return res.json({
      result: true,
      message: "Create Workspace Successfully",
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

exports.getMyWorkspace = async (req, res) => {
  try {
    const user_id = req.user.id;

    const rows = await workspace.getMyWorkspace(user_id);

    return res.json({
      result: true,
      message: "Get My Workspace Successfully",
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
