const task = require("../../models/user/task");

exports.getTasksByTeam = async (team_id, workspace_id) => {
  const row = await task.getTasksByTeam(team_id, workspace_id);
  return row;
};

exports.createTask = async (team_id, body, user_id) => {
  if (body.start_date && body.end_date) {
    if (body.start_date > body.end_date) {
      throw new Error("Start date cannot be after end date");
    }
  }

  const task_id = await task.createTask(team_id, body, user_id);

  return task_id;
};

exports.findTaskById = async (task_id) => {
  const row = await task.findTaskById(task_id);
  return row;
};

exports.getTaskActivityById = async (task_id, team_id) => {
  const checkTask = await task.findTaskById(task_id);
  if (checkTask.length === 0) {
    throw new Error("Task not found");
  }

  const checkTaskInTeam = await task.checkTaskInTeam(task_id, team_id);
  if (checkTaskInTeam.length === 0) {
    throw new Error("Task is not in that team");
  }

  const rows = await task.getTaskActivityById(task_id);
  return rows;
};

exports.createTaskActivity = async (task_id, user_id, action, message) => {
  const row = await task.createTaskActivity(task_id, user_id, action, message);
  return row;
};
