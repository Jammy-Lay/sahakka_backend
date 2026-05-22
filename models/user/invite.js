const pool = require("../../configs/db");

exports.createTokenInvite = async (
  workspace_id,
  team_id,
  token,
  expires_at,
) => {
  let sql =
    "INSERT INTO invites (workspace_id, team_id, token, expires_at)VALUES (?, ?, ?, ?)";
  const [result] = await pool.query(sql, [
    workspace_id,
    team_id,
    token,
    expires_at,
  ]);
  return result.insertId;
};

exports.findByToken = async (token) => {
  let sql =
    "SELECT workspace_id, team_id, status, expires_at FROM invites WHERE token = ?";
  const [row] = await pool.query(sql, [token]);
  return row;
};

exports.findByWorkspaceAndTeam = async (workspace_id, team_id) => {
  const sql =
    "SELECT token FROM invites WHERE workspace_id = ? AND team_id = ?";
  const [row] = await pool.query(sql, [workspace_id, team_id]);
  return row;
};

exports.updateToken = async (workspace_id, team_id, token, expires_at) => {
  const sql = `
    UPDATE invites 
    SET token = ?, expires_at = ?, status = 'pending'
    WHERE workspace_id = ? AND team_id = ?
  `;
  await pool.query(sql, [token, expires_at, workspace_id, team_id]);
};

exports.updateStatus = async (id, status) => {
  let sql = "UPDATE invites SET status = ? WHERE id = ?";
  await pool.query(sql, [status, id]);
};
