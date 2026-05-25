const submission = require("../../models/user/submission");
const task = require("../../models/user/task");
const team = require("../../models/user/team");

exports.submitTask = async (task_id, user, message, files) => {
  const checkTask = await task.findTaskById(task_id);
  if (checkTask.length === 0) throw new Error("Task not found");

  const checkTeam = await team.checkTeamMember(user.id, checkTask[0].team_id);
  if (checkTeam.length === 0) {
    throw new Error("You are not in this team");
  }

  const submission_id = await submission.createSubmission(
    task_id,
    user.id,
    message,
  );

  if (files && files.length > 0) {
    for (let file of files) {
      await submission.addSubmissionFile(submission_id, file);
    }
  }

  await task.updateStatus(task_id, "submitted");

  return {
    submission_id,
  };
};
