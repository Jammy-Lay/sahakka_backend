const invite = require("../../models/user/invite");
const team = require("../../models/user/team");
const users = require("../../models/users");
const workspace = require("../../models/user/workspace");
const crypto = require("crypto");
const { sendInviteByEmail } = require("../mail/mailService");

exports.createTokenInvite = async (workspace_id, team_id) => {
  const token = crypto.randomBytes(4).toString("hex"); // 8 chars
  const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

  const row = await invite.findByWorkspaceAndTeam(workspace_id, team_id);
  if (row.length === 0) {
    await invite.createTokenInvite(workspace_id, team_id, token, expires_at);
  } else {
    await invite.updateToken(workspace_id, team_id, token, expires_at);
  }

  return {
    token,
    workspace_id,
    team_id,
  };
};

exports.joinByToken = async (token, user) => {
  if (!token) throw new Error("Token required");

  const row = await invite.findByToken(token);

  if (row.length === 0) {
    throw new Error("Invalid invite token");
  }

  const data = row[0];

  if (data.status === "expired") {
    throw new Error("Token expired");
  }

  if (new Date(data.expires_at) < new Date()) {
    throw new Error("Token expired");
  }

  if (data.email && data.email !== user.email) {
    throw new Error("This invite is not for your account");
  }

  const checkTeam = await team.checkTeamMember(user.id, data.team_id);

  if (checkTeam.length > 0) {
    throw new Error("Already join this team");
  }

  const checkWorkspaceMember = await workspace.checkWorkspaceMember(
    user.id,
    data.workspace_id,
  );

  if (checkWorkspaceMember.length === 0) {
    await workspace.addWorkspaceMember({
      workspace_id: data.workspace_id,
      user_id: user.id,
      role: "member",
    });
  }

  await team.addTeamMember(data.team_id, user.id);

  await invite.updateStatus(data.id, "accepted");

  return {
    workspace_id: data.workspace_id,
    team_id: data.team_id,
  };
};

exports.inviteByEmail = async (workspace_id, team_id, email, user) => {
  const token = crypto.randomBytes(4).toString("hex");
  const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const row = await users.findByEmail(email);

  if (row.length > 0) {
    const existingUser = row[0];

    const checkTeam = await team.checkTeamMember(existingUser.id, team_id);

    if (checkTeam.length > 0) {
      throw new Error("User already in this team");
    }
  }

  const existingInvite = await invite.findByEmail(workspace_id, team_id, email);

  if (existingInvite.length > 0) {
    await invite.updateToken(workspace_id, team_id, token, expires_at);
  } else {
    await invite.createInviteByEmail(
      workspace_id,
      team_id,
      email,
      token,
      expires_at,
    );
  }

  if (row.length > 0) {
    const data = await workspace.findWorkspaceWithTeam(workspace_id, team_id);

    await sendInviteByEmail(
      email,
      data.workspace_name,
      data.title,
      user.name,
      token,
    );
  }

  return { message: "Invite sent successfully" };
};
