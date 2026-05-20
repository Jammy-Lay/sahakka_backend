const team = require("../../models/user/team");
const workspace = require("../../models/user/workspace");

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

exports.getTeamsByWorkspace = async (workspace_id) => {
  const rows = await team.getTeamsByWorkspace(workspace_id);

  const teams = [];

  for (const row of rows) {
    // find team
    let team = null;

    for (const t of teams) {
      if (t.team_id === row.team_id) {
        team = t;
        break;
      }
    }

    // create team if not exist
    if (!team) {
      team = {
        team_id: row.team_id,
        title: row.title,
        description: row.description,
        members: [],
      };
      teams.push(team);
    }

    // add member
    if (row.user_id) {
      team.members.push({
        user_id: row.user_id,
        name: row.user_name,
        role: row.workspace_role,
        avatar: row.avatar,
      });
    }
  }

  return teams;
};
