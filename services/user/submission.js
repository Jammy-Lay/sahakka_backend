const submission = require("../../models/user/submission");
const task = require("../../models/user/task");
const team = require("../../models/user/team");
const workspace = require("../../models/user/workspace");
const users = require("../../models/users");
const { sendSubmissionReviewEmail } = require("../mail/mailService");

exports.submitTask = async (task_id, user, message, file) => {
  const taskRow = await task.findTaskById(task_id);

  if (taskRow.length === 0) {
    throw new Error("Task not found");
  }

  const taskData = taskRow[0];

  const submission_id = await submission.createSubmission(
    task_id,
    user.id,
    message,
  );

  if (file) {
    const file_url = `${process.env.BASE_URL}/uploads/submissions/${file.filename}`;

    await submission.addSubmissionFile(submission_id, file_url);
  }

  await task.updateStatus("submitted", task_id);

  await task.createTaskActivity(
    task_id,
    user.id,
    "submit",
    "submitted task for review",
  );

  await team.createTeamActivity(
    taskData.team_id,
    user.id,
    "submit",
    `submitted task ${taskData.title} for review`,
  );

  const row = await submission.getSubmissionById(submission_id);

  const data = row[0];

  return {
    submission_id: data.id,
    task_id: data.task_id,
    title: data.task_title,
    message: data.message,
    status: data.status,
    file: data.file_url || null,
    created_at: data.created_at,

    submitted_by: {
      user_id: data.user_id,
      name: data.user_name,
      avatar: data.user_avatar,
    },
  };
};

exports.getAllSubmissions = async (workspace_id, team_id) => {
  const rows = await submission.getSubmissionsByWorkspaceAndTeam(
    workspace_id,
    team_id,
  );

  return rows.map((item) => ({
    submission_id: item.id,

    task: {
      task_id: item.task_id,
      title: item.task_title,
    },

    message: item.message,
    status: item.status,
    file: item.file_url || null,
    created_at: item.created_at,

    submitted_by: {
      user_id: item.user_id,
      name: item.user_name,
      avatar: item.user_avatar,
    },
  }));
};

exports.updateSubmissionStatus = async (
  workspace_id,
  team_id,
  submission_id,
  status,
  feedback,
  user,
) => {
  const row = await submission.getSubmissionById(submission_id);

  if (row.length === 0) {
    throw new Error("Submission not found");
  }

  const data = row[0];

  if (data.team_id != team_id) {
    throw new Error("Submission does not belong to this team");
  }

  if (data.workspace_id != workspace_id) {
    throw new Error("Submission does not belong to this workspace");
  }

  if (data.status !== "pending") {
    throw new Error("Submission already reviewed");
  }

  await submission.updateSubmissionStatus(
    submission_id,
    status,
    feedback,
    user.id,
  );

  await task.updateStatus(status, data.task_id);

  await task.createTaskActivity(
    data.task_id,
    user.id,
    "review",
    status === "approved"
      ? "approved the submission"
      : "rejected the submission",
  );

  const teamMessage =
    status === "approved"
      ? `approved submission for task ${data.task_title}`
      : `rejected submission for task ${data.task_title}`;

  await team.createTeamActivity(team_id, user.id, "review", teamMessage);

  const updatedRow = await submission.getSubmissionById(submission_id);
  const updated = updatedRow[0];

  const submitter = await users.findById(updated.user_id);

  const ws = await workspace.findById(data.workspace_id);
  const tm = await team.findById(data.team_id);

  await sendSubmissionReviewEmail(
    submitter[0].email,
    ws.workspace_name,
    tm.team_name,
    updated.task_title,
    updated.reviewer_name,
    updated.reviewer_avatar,
    status,
    feedback,
    workspace_id,
    team_id,
  );

  return {
    submission_id: updated.id,
    task_id: updated.task_id,
    title: updated.task_title,
    status: updated.status,
    feedback: updated.feedback,
    reviewed_at: updated.reviewed_at,

    reviewed_by: {
      user_id: updated.reviewer_id,
      name: updated.reviewer_name,
      avatar: updated.reviewer_avatar,
    },
  };
};
