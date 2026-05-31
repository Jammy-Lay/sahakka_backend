const workspace = require("../../services/user/workspace");
const team = require("../../services/user/team");

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
      workspace_id,
      team_id,
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

exports.deleteWorkspace = async (req, res) => {
  try {
    const { workspace_id } = req.params;
    await workspace.deleteWorkspace(workspace_id);

    return res.json({
      result: true,
      message: "Delete Workspace Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.updateWorkspace = async (req, res) => {
  try {
    const { workspace_id } = req.params;
    await workspace.updateWorkspace(req.body.name, workspace_id);
    const row = await workspace.findById(workspace_id, req.user);

    return res.json({
      result: true,
      message: "Update Workspace Successfully",
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

exports.updateMemberRole = async (req, res) => {
  try {
    const { workspace_id, team_id, user_id } = req.params;
    const { role } = req.body;

    const result = await workspace.updateMemberRole(
      workspace_id,
      user_id,
      role,
    );

    return res.json({
      result: true,
      message: "Role updated successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};
