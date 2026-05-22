const invite = require("../../models/user/invite");
const team = require("../../models/user/team");
const workspace = require("../../models/user/workspace");
const crypto = require("crypto");

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

exports.joinByToken = async (token, user_id) => {
  if (!token) throw new Error("Token required");

  const row = await invite.findByToken(token);

  if (row.length === 0) {
    throw new Error("Invalid token invite");
  }

  const data = row[0];
  const workspace_id = data.workspace_id;
  const team_id = data.team_id;

  const checkTeam = await team.checkTeamMember(user_id, team_id);

  if (checkTeam.length > 0) {
    throw new Error("Already join this team");
  }

  if (data.status === "expired") {
    throw new Error("Token invite expired");
  }

  if (new Date(data.expires_at) < new Date()) {
    throw new Error("Token invite expired");
  }

  await workspace.addWorkspaceMember({
    workspace_id,
    user_id,
    role: "member",
  });

  await team.addTeamMember(team_id, user_id);

  return {
    workspace_id,
    team_id,
  };
};
