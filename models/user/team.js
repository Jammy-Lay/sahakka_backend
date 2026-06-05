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

    ORDER BY t.created_at DESC `;

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

exports.deleteTeam = async (team_id) => {
  let sql = "DELETE FROM teams WHERE id = ?";
  await pool.query(sql, [team_id]);
};

exports.updateTeam = async (title, description, team_id) => {
  let sql = "UPDATE teams SET title = ? , description = ? WHERE id = ?";
  await pool.query(sql, [title, description, team_id]);
};

exports.getTeamActivityById = async (team_id) => {
  let sql = `
    SELECT 
      ta.id,
      ta.team_id,
      ta.user_id,
      ta.action,
      ta.message,
      ta.created_at,

      u.id AS created_by_id,
      u.name AS created_by_name,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS created_by_avatar

    FROM team_activities ta
    JOIN users u ON u.id = ta.user_id
    WHERE ta.team_id = ?
    ORDER BY ta.created_at DESC `;

  const [rows] = await pool.query(sql, [process.env.BASE_URL, team_id]);

  return rows;
};

exports.createTeamActivity = async (team_id, user_id, action, message) => {
  let sql =
    "INSERT INTO team_activities (team_id, user_id, action, message) VALUES (?, ?, ?, ?)";

  const result = await pool.query(sql, [team_id, user_id, action, message]);
  return result.insertId;
};

exports.findById = async (team_id) => {
  let sql = "SELECT id AS team_id, title as team_name FROM teams WHERE id = ?";
  const [row] = await pool.query(sql, [team_id]);
  return row[0];
};

exports.countTeamByWorkspace = async (workspace_id) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS total FROM teams WHERE workspace_id = ?",
    [workspace_id],
  );

  return rows[0].total;
};

exports.removeTeamMember = async (team_id, user_id) => {
  let sql = "DELETE FROM team_members WHERE team_id = ? AND user_id = ?";
  await pool.query(sql, [team_id, user_id]);
};

exports.checkUserOtherTeams = async (workspace_id, user_id) => {
  let sql =
    "SELECT tm.id FROM team_members tm JOIN teams t ON t.id = tm.team_id WHERE t.workspace_id = ? AND tm.user_id = ?";

  const [rows] = await pool.query(sql, [workspace_id, user_id]);

  return rows;
};

exports.getTeamMembers = async (workspace_id, team_id) => {
  let sql = `
    SELECT
      tm.user_id,
      tm.created_at,

      u.name,
      u.email,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS avatar,

      wm.role

    FROM team_members tm

    JOIN users u
      ON u.id = tm.user_id

    JOIN teams t
      ON t.id = tm.team_id

    LEFT JOIN workspace_members wm
      ON wm.user_id = tm.user_id
      AND wm.workspace_id = t.workspace_id

    WHERE tm.team_id = ?
      AND t.workspace_id = ?

    ORDER BY
      CASE
        WHEN wm.role = "owner" THEN 1
        WHEN wm.role = "moderator" THEN 2
        ELSE 3
      END,
      u.name ASC `;

  const [rows] = await pool.query(sql, [
    process.env.BASE_URL,
    team_id,
    workspace_id,
  ]);

  return rows;
};

exports.removeUserFromAllTeams = async (workspace_id, user_id) => {
  const sql =
    "DELETE tm FROM team_members tm JOIN teams t ON t.id = tm.team_id WHERE t.workspace_id = ? AND tm.user_id = ?";

  await pool.query(sql, [workspace_id, user_id]);
};
