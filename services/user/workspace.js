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
