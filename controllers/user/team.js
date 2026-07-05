const team = require("../../services/user/team");
const workspace = require("../../services/user/workspace");
const { getIO } = require("../../configs/socket");

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
    return res.status(400).json({
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
    return res.status(400).json({
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

    const members = await team.getTeamMembers(workspace_id, team_id);

    await team.deleteTeam(team_id, workspace_id);

    const io = getIO();
    members.forEach((member) => {
      if (String(member.user_id) === String(req.user.id)) {
        io.to(`user:${member.user_id}`).emit("team-updated", {
          workspace_id,
          team_id,
        });
      } else {
        io.to(`user:${member.user_id}`).emit("kicked-from-team", {
          workspace_id,
          team_id,
        });
      }
    });

    io.to(`workspace:${workspace_id}:team:${team_id}`).emit("team-deleted", {
      workspace_id,
      team_id,
    });

    return res.json({ result: true, message: "Delete Team Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ result: false, message: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { workspace_id, team_id } = req.params;

    await team.updateTeam(
      req.validData.title,
      req.validData.description,
      team_id,
      req.user.id,
    );

    const row = await workspace.findWorkspaceWithTeam(
      workspace_id,
      team_id,
      req.user,
    );

    const io = getIO();
    const members = await team.getTeamMembers(workspace_id, team_id);
    members.forEach((member) => {
      io.to(`user:${member.user_id}`).emit("team-updated", {
        workspace_id,
        team_id,
      });
    });

    return res.json({
      result: true,
      message: "Update Team Successfully",
      data: row,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ result: false, message: error.message });
  }
};

exports.removeTeamMember = async (req, res) => {
  try {
    const { workspace_id, team_id, user_id } = req.params;

    const members = await team.getTeamMembers(workspace_id, team_id);

    const { removedFromWorkspace } = await team.removeTeamMember(
      workspace_id,
      team_id,
      user_id,
      req.user.id,
    );

    const io = getIO();

    if (removedFromWorkspace) {
      io.to(`user:${user_id}`).emit("kicked-from-workspace", {
        workspace_id,
      });
    } else {
      io.to(`user:${user_id}`).emit("kicked-from-team", {
        workspace_id,
        team_id,
      });
    }

    members.forEach((member) => {
      if (String(member.user_id) === String(user_id)) return;
      io.to(`user:${member.user_id}`).emit("team-member-removed", {
        workspace_id,
        team_id,
        user_id,
      });
    });

    io.to(`workspace:${workspace_id}:team:${team_id}`).emit(
      "team-member-removed",
      { workspace_id, team_id, user_id },
    );

    return res.json({ result: true, message: "Member removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ result: false, message: error.message });
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

exports.getTeamById = async (req, res) => {
  try {
    const { workspace_id, team_id } = req.params;

    const row = await team.getTeamById(workspace_id, team_id);

    return res.json({
      result: true,
      message: "Get Team Successfully",
      data: row,
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};
