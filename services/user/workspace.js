const workspace = require("../../models/user/workspace");

exports.createWorkspace = async (name, owner_id) => {
  let result = await workspace.createWorkspace(name, owner_id);
  return result;
};

exports.addWorkspaceMember = async (body) => {
  await workspace.addWorkspaceMember(body);
};

exports.findWorkspaceWithTeam = async (team_id, workspace_id, user) => {
  const row = await workspace.findWorkspaceWithTeam(team_id, workspace_id);

  return {
    workspace: {
      workspace_id: row.workspace_id,
      workspace_name: row.workspace_name,
      creator: {
        user_id: user.id,
        user_name: user.name,
        role: "owner",
      },
      created_at: row.workspace_created_at,
    },
    team: {
      team_id: row.team_id,
      title: row.title,
      description: row.description,
      created_at: row.team_created_at,
    },
  };
};

// exports.getMyWorkspace = async (workspace_id, user_id) => {
//   const rows = await workspace.getMyWorkspace(workspace_id, user_id);

//   if (rows.length === 0) throw new Error("Workspace not found");

//   const isOwner = rows[0].workspace_role === "owner";

//   const result = {
//     workspace: {
//       workspace_id: rows[0].workspace_id,
//       name: rows[0].workspace_name,
//       role: rows[0].workspace_role,
//       created_at: rows[0].created_at,
//     },
//     teams: [],
//   };

//   for (let row of rows) {
//     if (!row.team_id) continue;

//     // IF NOT OWNER → only allow teams user belongs to
//     if (!isOwner) {
//       const isInTeam = rows.some(
//         (r) => r.team_id === row.team_id && r.user_id === user_id,
//       );

//       if (!isInTeam) continue;
//     }

//     let team = result.teams.find((t) => t.team_id === row.team_id);

//     if (!team) {
//       team = {
//         team_id: row.team_id,
//         title: row.team_title,
//         description: row.description,
//         members: [],
//       };
//       result.teams.push(team);
//     }

//     // show all members in that team
//     if (row.user_id) {
//       let exist = team.members.find((m) => m.user_id === row.user_id);

//       if (!exist) {
//         team.members.push({
//           user_id: row.user_id,
//           user_name: row.user_name,
//         });
//       }
//     }
//   }

//   return result;
// };

exports.getMyWorkspace = async (user_id) => {
  const rows = await workspace.getMyWorkspace(user_id);

  if (rows.length === 0) return [];

  const result = [];

  for (const row of rows) {
    result.push({
      workspace_id: row.workspace_id,
      workspace_name: row.workspace_name,
      created_at: row.created_at,

      creator: {
        role: row.role,
        user_id: row.owner_id,
        user_name: row.owner_name,
        avatar: row.owner_avatar,
      },
    });
  }

  return result;
};
