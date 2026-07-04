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
    "SELECT id, workspace_id, team_id, email, status, expires_at FROM invites WHERE token = ?";
  const [row] = await pool.query(sql, [token]);
  return row;
};

exports.findByWorkspaceAndTeam = async (workspace_id, team_id) => {
  const sql =
    "SELECT id, token, email, status FROM invites WHERE workspace_id = ? AND team_id = ? AND email IS NULL";

  const [row] = await pool.query(sql, [workspace_id, team_id]);

  return row;
};

exports.updateToken = async (id, token, expires_at) => {
  const sql =
    "UPDATE invites SET token = ?, expires_at = ?, status = 'pending', email = NULL WHERE id = ?";

  await pool.query(sql, [token, expires_at, id]);
};

exports.updateTokenByEmail = async (id, token, expires_at) => {
  const sql =
    "UPDATE invites SET token = ?, expires_at = ?, status = 'pending' WHERE id = ?";

  await pool.query(sql, [token, expires_at, id]);
};

exports.updateStatus = async (id, status) => {
  let sql = "UPDATE invites SET status = ? WHERE id = ?";
  await pool.query(sql, [status, id]);
};

exports.createInviteByEmail = async (
  workspace_id,
  team_id,
  email,
  token,
  expires_at,
) => {
  const sql =
    "INSERT INTO invites (workspace_id, team_id, email, token, expires_at)VALUES (?, ?, ?, ?, ?)";

  const [result] = await pool.query(sql, [
    workspace_id,
    team_id,
    email,
    token,
    expires_at,
  ]);

  return result.insertId;
};

exports.findByEmail = async (workspace_id, team_id, email) => {
  let sql =
    "SELECT id, workspace_id, team_id, email, status, expires_at FROM invites WHERE workspace_id = ? AND team_id = ? AND email = ?";

  const [rows] = await pool.query(sql, [workspace_id, team_id, email]);

  return rows;
};
