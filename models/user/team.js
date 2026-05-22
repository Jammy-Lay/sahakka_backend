const pool = require("../../configs/db");

exports.defaultTeam = async (body) => {
  let sql =
    "INSERT INTO teams(workspace_id, title, description) VALUES (?, ?, ?)";
  let data = [body.workspace_id, body.title, body.description];
  let [result] = await pool.query(sql, data);
  return result.insertId;
};

exports.createTeam = async (workspace_id, title, description) => {
  let sql =
    "INSERT INTO teams(workspace_id, title, description) VALUES (?, ?, ?)";
  let [result] = await pool.query(sql, [workspace_id, title, description]);
  return result.insertId;
};

exports.addTeamMember = async (team_id, user_id) => {
  let sql = "INSERT INTO team_members(team_id, user_id) VALUES (?, ?)";
  await pool.query(sql, [team_id, user_id]);
};

exports.addTeamSection = async (team_id) => {
  let sql = "INSERT INTO team_sections(team_id, name) VALUES (?, ?)";
  const sections = ["Tasks", "Issues", "Documents", "Activity"];

  for (let name of sections) {
    await pool.query(sql, [team_id, name]);
  }
};

exports.getSectionsByTeam = async (team_id) => {
  let sql =
    "SELECT id, team_id, name FROM team_sections WHERE team_id = ? ORDER BY id ASC";

  const [rows] = await pool.query(sql, [team_id]);
  return rows;
};

exports.getTeamsByWorkspace = async (workspace_id, user_id) => {
  let sql = `
    SELECT
      t.id AS team_id,
      t.title,
      t.description,

      u.id AS user_id,
      u.name AS user_name,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS avatar,

      wm.role AS workspace_role

    FROM teams t

    LEFT JOIN team_members tm
      ON tm.team_id = t.id

    LEFT JOIN users u
      ON u.id = tm.user_id

    LEFT JOIN workspace_members wm
      ON wm.user_id = u.id
      AND wm.workspace_id = t.workspace_id

    WHERE t.workspace_id = ?

    AND (
      EXISTS (
        SELECT 1 FROM workspace_members 
        WHERE user_id = ? 
        AND workspace_id = ?
        AND role = 'owner'
      )
      OR t.id IN (
        SELECT team_id FROM team_members WHERE user_id = ?
      )
    )

    ORDER BY t.created_at DESC
  `;

  const [rows] = await pool.query(sql, [
    process.env.BASE_URL,
    workspace_id,
    user_id,
    workspace_id,
    user_id,
  ]);

  return rows;
};

exports.checkTeamInWorkspace = async (team_id, workspace_id) => {
  let sql = "SELECT id FROM teams WHERE id = ? AND workspace_id = ?";
  const [row] = await pool.query(sql, [team_id, workspace_id]);
  return row;
};

exports.checkTeamMember = async (user_id, team_id) => {
  let sql = "SELECT id FROM team_members WHERE user_id = ? AND team_id = ?";
  const [row] = await pool.query(sql, [user_id, team_id]);
  return row;
};

exports.getTeamActivityById = async (team_id) => {
  let sql = `
    SELECT ta.*, u.name
    FROM team_activities ta
    JOIN users u ON u.id = ta.user_id
    WHERE ta.team_id = ?
    ORDER BY ta.created_at DESC
  `;

  const [rows] = await pool.query(sql, [team_id]);
  return rows;
};

exports.createTeamActivity = async (team_id, user_id, action, message) => {
  let sql =
    "INSERT INTO team_activities (team_id, user_id, action, message) VALUES (?, ?, ?, ?)";

  const result = await pool.query(sql, [team_id, user_id, action, message]);
  return result.insertId;
};
