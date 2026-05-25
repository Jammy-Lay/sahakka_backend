const team = require("../../models/user/team");

exports.defaultTeam = async (body) => {
  let result = await team.defaultTeam(body);
  return result;
};

exports.createTeam = async (workspace_id, title, description) => {
  let result = await team.createTeam(workspace_id, title, description);
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

exports.deleteTeam = async (team_id) => {
  await team.deleteTeam(team_id);
};

exports.updateTeam = async (title, description, team_id) => {
  await team.updateTeam(title, description, team_id);
};

exports.findTeam = async (team_id) => {
  const row = await team.findById(team_id);
  return {
    team_id: row.team_id,
    team_name: row.team_name,
  };
};
