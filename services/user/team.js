const team = require("../../models/user/team");
const workspace = require("../../models/user/workspace");
const users = require("../../models/users");

exports.defaultTeam = async (body) => {
  let result = await team.defaultTeam(body);
  return result;
};

exports.createTeam = async (workspace_id, title, description) => {
  const total = await team.countTeamByWorkspace(workspace_id);

  if (total >= 5) {
    throw new Error("Maximum 5 teams allowed in a workspace");
  }

  const result = await team.createTeam(workspace_id, title, description);
  return result;
};

exports.addTeamMember = async (team_id, user_id) => {
  await team.addTeamMember(team_id, user_id);
};

exports.addTeamSection = async (team_id) => {
  await team.addTeamSection(team_id);
};

exports.getSectionsByTeam = async (team_id) => {
  const rows = await team.getSectionsByTeam(team_id);
  if (rows.length === 0) {
    throw new Error("Team not found");
  }
  return rows;
};

exports.getTeamsByWorkspace = async (workspace_id, user_id) => {
  const rows = await team.getTeamsByWorkspace(workspace_id, user_id);

  if (rows.length === 0) {
    throw new Error("You are not in this workspace");
  }

  const teams = [];

  for (const row of rows) {
    // find existing team
    let team = null;

    for (const t of teams) {
      if (t.team_id === row.team_id) {
        team = t;
        break;
      }
    }

    // create new team
    if (!team) {
      team = {
        team_id: row.team_id,
        title: row.title,
        description: row.description,
        members: [],
      };
      teams.push(team);
    }

    // add member (avoid duplicate)
    if (row.user_id) {
      const exist = team.members.find((m) => m.user_id === row.user_id);

      if (!exist) {
        team.members.push({
          user_id: row.user_id,
          name: row.user_name,
          role: row.workspace_role,
          avatar: row.avatar,
        });
      }
    }
  }

  return teams;
};

exports.getTeamActivityById = async (team_id) => {
  const rows = await team.getTeamActivityById(team_id);

  const data = rows.map((item) => ({
    id: item.id,
    team_id: item.team_id,
    action: item.action,
    message: item.message,
    created_at: item.created_at,

    created_by: {
      user_id: item.created_by_id,
      name: item.created_by_name,
      avatar: item.created_by_avatar,
    },
  }));

  return data;
};

exports.createTeamActivity = async (team_id, user_id, action, message) => {
  const row = await team.createTeamActivity(team_id, user_id, action, message);
  return row;
};

exports.deleteTeam = async (team_id, workspace_id) => {
  const total = await team.countTeamByWorkspace(workspace_id);

  if (total === 1) {
    throw new Error("Cannot delete the last team");
  }

  await team.deleteTeam(team_id);
};

exports.updateTeam = async (title, description, team_id, user_id) => {
  const oldTeam = await team.findById(team_id);

  if (!oldTeam) {
    throw new Error("Team not found");
  }

  await team.updateTeam(title, description, team_id);

  if (oldTeam.team_name !== title) {
    await team.createTeamActivity(
      team_id,
      user_id,
      "update",
      `renamed team ${oldTeam.team_name} to ${title}`,
    );
  }
};

exports.findTeam = async (team_id) => {
  const row = await team.findById(team_id);
  return {
    team_id: row.team_id,
    team_name: row.team_name,
  };
};

exports.removeTeamMember = async (
  workspace_id,
  team_id,
  user_id,
  removed_by,
) => {
  const member = await team.checkTeamMember(user_id, team_id);

  if (member.length === 0) {
    throw new Error("User is not in this team");
  }

  const workspaceMember = await workspace.checkWorkspaceMember(
    user_id,
    workspace_id,
  );

  if (workspaceMember.length > 0 && workspaceMember[0].role === "owner") {
    throw new Error("Workspace owner cannot be removed");
  }

  const userInfo = await users.findById(user_id);

  if (userInfo.length === 0) {
    throw new Error("User not found");
  }

  await team.removeTeamMember(team_id, user_id);

  const otherTeams = await team.checkUserOtherTeams(workspace_id, user_id);

  let removedFromWorkspace = false;

  if (otherTeams.length === 0) {
    await workspace.removeWorkspaceMember(workspace_id, user_id);
    removedFromWorkspace = true;
  }

  await team.createTeamActivity(
    team_id,
    removed_by,
    "remove",
    `removed ${userInfo[0].name} from the team`,
  );

  return { removedFromWorkspace };
};

exports.getTeamMembers = async (workspace_id, team_id) => {
  const checkTeam = await team.checkTeamInWorkspace(team_id, workspace_id);

  if (checkTeam.length === 0) {
    throw new Error("Team not found in workspace");
  }

  const rows = await team.getTeamMembers(workspace_id, team_id);

  return rows.map((item) => ({
    user_id: item.user_id,
    name: item.name,
    email: item.email,
    avatar: item.avatar,
    role: item.role,
    joined_at: item.created_at,
  }));
};

exports.getTeamById = async (workspace_id, team_id) => {
  const rows = await team.getTeamById(workspace_id, team_id);

  if (rows.length === 0) {
    throw new Error("Team not found");
  }

  const data = rows[0];

  const result = {
    team_id: data.team_id,
    title: data.title,
    description: data.description,
    members: [],
  };

  for (const row of rows) {
    if (row.user_id) {
      result.members.push({
        user_id: row.user_id,
        name: row.user_name,
        role: row.workspace_role,
        avatar: row.avatar,
      });
    }
  }

  return result;
};

exports.getCoMembersOfUser = async (userId) => {
  const rows = await team.getCoMembersOfUser(userId);
  return rows.map((row) => row.user_id);
};
