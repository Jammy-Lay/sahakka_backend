const admin = require('../../models/admin/admin_management');
const activityTeam = require('../../models/user/team');
const team = require('../../models/user/team');
const workspace = require('../../models/user/workspace');

//user

exports.getUsers = async () => {
  return await admin.getAllUsers();
};

exports.getUserById = async (userId) => {
  return await admin.getUserById(userId);
};

exports.suspendUser = async (userId) => {
    let check_is_active = await admin.getUserById(userId);
    if(check_is_active[0].is_active === 0){
      throw new Error('User has been block already')
    }
  await admin.suspendUser(userId);
};

exports.activateUser = async (userId) => {
  let check_is_active = await admin.getUserById(userId);
    if(check_is_active[0].is_active === 1){
      throw new Error('User has been active already')
    }
  await admin.activateUser(userId);
};

//workspace
exports.getWorkspaces = async () => {
  const rows = await admin.getAllWorkspaces();

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

exports.getWorkspaceDetails = async (workspaceId) => {
  const rows = await admin.getWorkspaceDetails(workspaceId);
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

//teams
exports.getTeams = async () => {

  const rows = await admin.getAllTeams();

  if (rows.length === 0) return [];

  const teamsMap = {};

  rows.forEach((row) => {

    // create team
    if (!teamsMap[row.team_id]) {

      teamsMap[row.team_id] = {
        team_id: row.team_id,
        title: row.title,
        description: row.description,

        workspace: {
          workspace_id: row.workspace_id,
          workspace_name: row.workspace_name
        },

        members: []
      };
    }

    // add members
    if (row.user_id) {
      teamsMap[row.team_id].members.push({
        user_id: row.user_id,
        name: row.name,
        role: row.role,
        avatar: row.avatar
      });
    }

  });

  return Object.values(teamsMap);
};

exports.getTeamById = async (team_id) => {

  const rows = await admin.getTeamById(team_id);

  if (rows.length === 0) return [];

  const teamsMap = {};

  rows.forEach((row) => {

    // create team
    if (!teamsMap[row.team_id]) {

      teamsMap[row.team_id] = {
        team_id: row.team_id,
        title: row.title,
        description: row.description,

        workspace: {
          workspace_id: row.workspace_id,
          workspace_name: row.workspace_name
        },

        members: []
      };
    }

    // add members
    if (row.user_id) {
      teamsMap[row.team_id].members.push({
        user_id: row.user_id,
        name: row.name,
        role: row.role,
        avatar: row.avatar
      });
    }

  });

  return Object.values(teamsMap);
};

exports.getTeamMembers = async (team_id) => {

  const rows = await admin.getTeamMembers(team_id);

  if (rows.length === 0) return [];

  const teamsMap = {};

  rows.forEach((row) => {

    // create team
    if (!teamsMap[row.team_id]) {

      teamsMap[row.team_id] = {
        team_id: row.team_id,
        title: row.title,
        description: row.description,
        members: []
      };
    }

    // add members
    if (row.user_id) {
      teamsMap[row.team_id].members.push({
        user_id: row.user_id,
        name: row.name,
        role: row.role,
        avatar: row.avatar
      });
    }

  });

  return Object.values(teamsMap);
};

//task
exports.getTasks = async () => {
  return await admin.getAllTasks();
};

exports.getTaskAnalytics = async () => {
  return await admin.getTaskAnalytics();
};

//dashboard

exports.getDashboardStats = async () => {
  return await admin.getDashboardStats();
};

exports.getTeamActivity = async (team_id) => {

  return await admin.getTeamActivityById(team_id);

};

exports.checkTeamInWorkspace = async (
  team_id,
  workspace_id
) => {

  return await team.checkTeamInWorkspace(
    team_id,
    workspace_id
  );

};
exports.checkWorkspaceMember = async (
  workspace_id,
  user_id
) => {

  return await admin.checkWorkspaceMember(
    workspace_id,
    user_id
  );

};


// task
exports.getTaskActivities = async (task_id) => {
    return await admin.getTaskActivityById(task_id);
};