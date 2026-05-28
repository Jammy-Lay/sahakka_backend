const submission = require("../../models/user/submission");
const task = require("../../models/user/task");
const team = require("../../models/user/team");

exports.submitTask = async (task_id, user, message, file) => {
  const checkTask = await task.findTaskById(task_id);
  if (checkTask.length === 0) throw new Error("Task not found");

  const taskData = checkTask[0];

  if (!taskData.assigned_to_id) {
    throw new Error("Task is not assigned yet");
  }

  if (taskData.assigned_to_id !== user.id) {
    throw new Error("You are not assigned to this task");
  }

  const pending = await submission.findPendingByTask(task_id);
  if (pending.length > 0) {
    throw new Error("Task already submitted, waiting for review");
  }

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

  const data = rows.map((item) => ({
    submission_id: item.id,

    workspace: {
      workspace_id: item.workspace_id,
      workspace_name: item.workspace_name,
    },

    team: {
      team_id: item.team_id,
      team_name: item.team_title,
    },

    task: {
      task_id: item.task_id,
      title: item.task_title,
    },

    message: item.message,
    status: item.status,
    created_at: item.created_at,

    submitted_by: {
      user_id: item.user_id,
      name: item.user_name,
      avatar: item.user_avatar,
    },

    file: item.file_url || null,
  }));

  return data;
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

  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }

  await submission.updateSubmissionStatus(
    submission_id,
    status,
    feedback,
    user.id,
  );

  const updatedRow = await submission.getSubmissionById(submission_id);
  const updated = updatedRow[0];

  return {
    submission_id: updated.id,
    task_id: updated.task_id,
    title: updated.task_title,
    message: updated.message,
    status: updated.status,
    feedback: updated.feedback,
    file: updated.file_url || null,
    created_at: updated.created_at,
    reviewed_at: updated.reviewed_at,

    submitted_by: {
      user_id: updated.user_id,
      name: updated.user_name,
      avatar: updated.user_avatar,
    },

    reviewed_by: {
      user_id: updated.reviewer_id,
      name: updated.reviewer_name,
      avatar: updated.reviewer_avatar,
    },
  };
};
