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
  if (row.length === 0) {
    throw new Error("Task not found");
  }
  return row;
};
