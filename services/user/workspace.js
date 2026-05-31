const workspace = require("../../models/user/workspace");

exports.createWorkspace = async (name, owner_id) => {
  const total = await workspace.countWorkspaceByOwner(owner_id);

  if (total >= 5) {
    throw new Error("Maximum 5 workspaces allowed");
  }

  const result = await workspace.createWorkspace(name, owner_id);
  return result;
};

exports.addWorkspaceMember = async (body) => {
  await workspace.addWorkspaceMember(body);
};

exports.findWorkspaceWithTeam = async (workspace_id, team_id, user) => {
  const row = await workspace.findWorkspaceWithTeam(workspace_id, team_id);

  return {
    workspace: {
      workspace_id: row.workspace_id,
      workspace_name: row.workspace_name,
      created_at: row.workspace_created_at,
      creator: {
        user_id: user.id,
        user_name: user.name,
        role: "owner",
      },
    },
    team: {
      team_id: row.team_id,
      title: row.title,
      description: row.description,
      created_at: row.team_created_at,
    },
  };
};

exports.findById = async (workspace_id, user) => {
  const row = await workspace.findById(workspace_id);

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
  };
};

exports.findWorkspace = async (workspace_id) => {
  const row = await workspace.findById(workspace_id);
  return {
    workspace_id: row.workspace_id,
    workspace_name: row.workspace_name,
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
      my_role: row.my_role,
      creator: {
        role: "owner",
        user_id: row.owner_id,
        user_name: row.owner_name,
        avatar: row.owner_avatar,
      },
    });
  }

  return result;
};

exports.deleteWorkspace = async (workspace_id) => {
  await workspace.deleteWorkspace(workspace_id);
};

exports.updateWorkspace = async (name, workspace_id) => {
  await workspace.updateWorkspace(name, workspace_id);
};
