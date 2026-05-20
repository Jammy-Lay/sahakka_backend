const pool = require("../configs/db");

exports.updateToApproved = async (id) => {
  let sql = "UPDATE demo_approvals SET status = 'approved' where id = ?";
  await pool.query(sql, [id]);
};

exports.updateToRejected = async (id) => {
  let sql = "UPDATE demo_approvals SET status = 'rejected' where id = ?";
  await pool.query(sql, [id]);
};

exports.getTask = async () => {
  let sql = "SELECT * FROM demo_approvals";
  let [row] = await pool.query(sql);
  return row;
};
