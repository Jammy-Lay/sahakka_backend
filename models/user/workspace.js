const pool = require("../../configs/db");

exports.createWorkspace = async (name, owner_id) => {
  let sql = "INSERT INTO workspaces(name, owner_id) VALUES (?, ?)";
  let [result] = await pool.query(sql, [name, owner_id]);
  return result.insertId;
};

exports.addWorkspaceMember = async (body) => {
  let sql =
    "INSERT INTO workspace_members(workspace_id, user_id, role) VALUES (?, ?, ?)";
  let data = [body.workspace_id, body.user_id, body.role];
  await pool.query(sql, data);
};

exports.checkWorkspaceMember = async (user_id, workspace_id) => {
  let sql =
    "SELECT role FROM workspace_members WHERE user_id = ? AND workspace_id = ?";
  let [row] = await pool.query(sql, [user_id, workspace_id]);
  return row;
};

exports.findWorkspaceWithTeam = async (workspace_id, team_id) => {
  const sql = `
    SELECT
      w.id AS workspace_id,
      w.name AS workspace_name,
      w.created_at AS workspace_created_at,

      t.id AS team_id,
      t.title,
      t.description,
      t.created_at AS team_created_at

    FROM workspaces w
    LEFT JOIN teams t ON t.workspace_id = w.id
    WHERE w.id = ? AND t.id = ? `;

  const [row] = await pool.query(sql, [workspace_id, team_id]);

  return row[0];
};

exports.getMyWorkspace = async (user_id) => {
  const sql = `
    SELECT
      w.id AS workspace_id,
      w.name AS workspace_name,
      w.created_at,

      wm.role AS my_role, 

      u.id AS owner_id,
      u.name AS owner_name,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS owner_avatar

    FROM workspace_members wm

    JOIN workspaces w
      ON w.id = wm.workspace_id

    JOIN users u
      ON u.id = w.owner_id

    WHERE wm.user_id = ?

    ORDER BY w.created_at DESC
  `;

  const [rows] = await pool.query(sql, [process.env.BASE_URL, user_id]);

  return rows;
};

exports.findById = async (workspace_id) => {
  const sql = `
    SELECT
      w.id AS workspace_id,
      w.name AS workspace_name,
      w.created_at

    FROM workspaces w
    WHERE w.id = ?`;

  const [row] = await pool.query(sql, [workspace_id]);

  return row[0];
};

exports.deleteWorkspace = async (workspace_id) => {
  let sql = "DELETE FROM workspaces WHERE id = ?";
  await pool.query(sql, [workspace_id]);
};

exports.updateWorkspace = async (name, workspace_id) => {
  let sql = "UPDATE workspaces SET name = ? WHERE id = ?";
  await pool.query(sql, [name, workspace_id]);
};

exports.countWorkspaceByOwner = async (user_id) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS total FROM workspaces WHERE owner_id = ?",
    [user_id],
  );

  return rows[0].total;
};

exports.removeWorkspaceMember = async (workspace_id, user_id) => {
  let sql =
    "DELETE FROM workspace_members WHERE workspace_id = ? AND user_id = ?";

  await pool.query(sql, [workspace_id, user_id]);
};

exports.updateMemberRole = async (workspace_id, user_id, role) => {
  let sql =
    "UPDATE workspace_members SET role = ? WHERE workspace_id = ? AND user_id = ?";

  await pool.query(sql, [role, workspace_id, user_id]);
};

exports.findWorkspaceByName = async (name) => {
  const [rows] = await pool.query(
    `
      SELECT id
      FROM workspaces
      WHERE name = ?
    `,
    [name]
  );

  return rows;
};
