const pool = require("../../configs/db");

exports.createSubmission = async (task_id, user_id, message) => {
  const sql =
    "INSERT INTO task_submissions (task_id, submitted_by, message) VALUES (?, ?, ?)";

  const [result] = await pool.query(sql, [task_id, user_id, message]);
  return result.insertId;
};

exports.addSubmissionFile = async (submission_id, file_url) => {
  const sql =
    "INSERT INTO submission_files (submission_id, file_url) VALUES (?, ?)";

  await pool.query(sql, [submission_id, file_url]);
};
