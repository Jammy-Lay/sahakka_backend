const workspace = require("../../services/user/workspace");
const team = require("../../services/user/team");
const { getIO } = require("../../configs/socket");

exports.createWorkspace = async (req, res) => {
  try {
    let name = req.validData.name;
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

    const members = await workspace.getWorkspaceMembers(workspace_id);

    await workspace.deleteWorkspace(workspace_id, req.user.id);

    const io = getIO();
    members.forEach((member) => {
      if (String(member.user_id) === String(req.user.id)) {
        io.to(`user:${member.user_id}`).emit("workspace-updated", {
          workspace_id,
        });
      } else {
        io.to(`user:${member.user_id}`).emit("kicked-from-workspace", {
          workspace_id,
        });
      }
    });

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
    await workspace.updateWorkspace(req.validData.name, workspace_id);
    const row = await workspace.findById(workspace_id, req.user);

    const io = getIO();
    const members = await workspace.getWorkspaceMembers(workspace_id);
    members.forEach((member) => {
      io.to(`user:${member.user_id}`).emit("workspace-updated", {
        workspace_id,
      });
    });

    return res.json({
      result: true,
      message: "Update Workspace Successfully",
      data: row,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ result: false, message: error.message });
  }
};

exports.updateMemberRole = async (req, res) => {
  try {
    const { workspace_id, user_id } = req.params;
    const { role } = req.validData;

    const result = await workspace.updateMemberRole(
      workspace_id,
      user_id,
      role,
    );

    const io = getIO();
    io.to(`user:${user_id}`).emit("role-updated", { workspace_id, role });

    return res.json({
      result: true,
      message: "Role updated successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ result: false, message: error.message });
  }
};

exports.getWorkspaceMembers = async (req, res) => {
  try {
    const { workspace_id } = req.params;

    const rows = await workspace.getWorkspaceMembers(workspace_id);

    return res.json({
      result: true,
      message: "Get Workspace member Successfully",
      data: rows,
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.removeWorkspaceMember = async (req, res) => {
  try {
    const { workspace_id, user_id } = req.params;

    const teams = await team.getTeamsByWorkspace(workspace_id, user_id);

    await workspace.removeWorkspaceMember(workspace_id, user_id, req.user.id);

    const io = getIO();

    io.to(`user:${user_id}`).emit("kicked-from-workspace", { workspace_id });

    teams.forEach((t) => {
      io.to(`workspace:${workspace_id}:team:${t.team_id}`).emit(
        "team-member-removed",
        {
          workspace_id,
          team_id: t.team_id,
          user_id,
        },
      );
    });

    return res.json({ result: true, message: "Member removed successfully" });
  } catch (error) {
    return res.status(400).json({ result: false, message: error.message });
  }
};

exports.leaveWorkspace = async (req, res) => {
  try {
    const { workspace_id } = req.params;
    const user_id = req.user.id;

    const teams = await team.getTeamsByWorkspace(workspace_id, user_id);

    await workspace.leaveWorkspace(workspace_id, user_id);

    const io = getIO();

    teams.forEach((t) => {
      io.to(`workspace:${workspace_id}:team:${t.team_id}`).emit(
        "team-member-removed",
        { workspace_id, team_id: t.team_id, user_id },
      );
    });

    return res.json({ result: true, message: "Left workspace successfully" });
  } catch (err) {
    return res.status(400).json({ result: false, message: err.message });
  }
};
