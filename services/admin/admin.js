const admin = require('../../models/admin/admin_management');

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

exports.deleteUser = async (userId) => {
    let check_user = await admin.getUsersById(userId);
    if(check_user == 0){
      throw new Error('User has been deleted')
    }
  await admin.deleteUser(userId);
};

//workspace

exports.getWorkspaces = async () => {
  return await admin.getAllWorkspaces();
};

exports.getWorkspaceDetails = async (workspaceId) => {
  return await admin.getWorkspaceDetails(workspaceId);
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