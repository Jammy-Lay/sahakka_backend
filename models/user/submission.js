const pool = require("../../configs/db");

exports.createSubmission = async (task_id, user_id, message) => {
  const sql =
    "INSERT INTO task_submissions (task_id, submitted_by, message) VALUES (?, ?, ?)";

  const [result] = await pool.query(sql, [task_id, user_id, message]);
  return result.insertId;
};

exports.findPendingByTask = async (task_id) => {
  const sql =
    "SELECT * FROM task_submissions WHERE task_id = ? AND status = 'pending'";
  const [rows] = await pool.query(sql, [task_id]);
  return rows;
};

exports.addSubmissionFile = async (submission_id, file_url) => {
  const sql =
    "INSERT INTO submission_files (submission_id, file_url) VALUES (?, ?)";

  await pool.query(sql, [submission_id, file_url]);
};

exports.getSubmissionById = async (submission_id) => {
  const sql = `
    SELECT
      s.id,
      s.task_id,
      s.message,
      s.status,
      s.feedback,
      s.created_at,
      s.reviewed_at,

      u.id AS user_id,
      u.name AS user_name,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS user_avatar,

      t.title AS task_title,
      t.team_id,

      tm.workspace_id,

      f.file_url,

      r.id AS reviewer_id,
      r.name AS reviewer_name,
      CONCAT(?, '/uploads/avatars/', r.avatar) AS reviewer_avatar

    FROM task_submissions s
    LEFT JOIN users u ON u.id = s.submitted_by
    LEFT JOIN tasks t ON t.id = s.task_id
    LEFT JOIN teams tm ON tm.id = t.team_id
    LEFT JOIN submission_files f ON f.submission_id = s.id
    LEFT JOIN users r ON r.id = s.reviewed_by

    WHERE s.id = ? `;

  const [rows] = await pool.query(sql, [
    process.env.BASE_URL,
    process.env.BASE_URL,
    submission_id,
  ]);

  return rows;
};

exports.findSubmissionByTask = async (task_id) => {
  const sql = `
    SELECT *
    FROM task_submissions
    WHERE task_id = ?
    ORDER BY id DESC
    LIMIT 1 `;

  const [rows] = await pool.query(sql, [task_id]);

  return rows;
};

exports.getSubmissionsByWorkspaceAndTeam = async (workspace_id, team_id) => {
  const sql = `
    SELECT
      s.id,
      s.task_id,
      s.message,
      s.status,
      s.feedback,
      s.created_at,

      u.id AS user_id,
      u.name AS user_name,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS user_avatar,

      t.title AS task_title,

      f.file_url

    FROM task_submissions s
    LEFT JOIN users u ON u.id = s.submitted_by
    LEFT JOIN tasks t ON t.id = s.task_id
    LEFT JOIN teams tm ON tm.id = t.team_id
    LEFT JOIN submission_files f ON f.submission_id = s.id

    WHERE tm.id = ? AND tm.workspace_id = ?

    ORDER BY s.created_at DESC
  `;

  const [rows] = await pool.query(sql, [
    process.env.BASE_URL,
    team_id,
    workspace_id,
  ]);

  return rows;
};

exports.updateSubmissionStatus = async (
  submission_id,
  status,
  feedback,
  reviewed_by,
) => {
  const sql =
    "UPDATE task_submissions SET  status = ?,  feedback = ?,  reviewed_by = ?,  reviewed_at = NOW() WHERE id = ?";

  await pool.query(sql, [status, feedback, reviewed_by, submission_id]);
};

exports.getSubmissionFeedbackByTask = async (task_id) => {
  const sql = `
    SELECT
      s.id AS submission_id,
      s.task_id,
      s.feedback,
      s.status,
      s.reviewed_at,

      r.id AS reviewer_id,
      r.name AS reviewer_name,
      CONCAT(?, '/uploads/avatars/', r.avatar) AS reviewer_avatar

    FROM task_submissions s
    LEFT JOIN users r ON r.id = s.reviewed_by

    WHERE s.task_id = ?
    ORDER BY s.id DESC
    LIMIT 1
  `;

  const [rows] = await pool.query(sql, [process.env.BASE_URL, task_id]);
  return rows;
};
