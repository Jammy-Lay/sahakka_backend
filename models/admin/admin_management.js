const pool = require("../../configs/db");

// user management
exports.getAllUsers = async () => {
  const [rows] = await pool.query(`
    SELECT id, name, email, role, is_active, is_verified, created_at
    FROM users WHERE role = 'user'
    ORDER BY created_at DESC
  `);

  return rows;
};
exports.getUserById = async (user_id) => {
  const [rows] = await pool.query(
    `
    SELECT id, name, email, role, is_active, is_verified, created_at
    FROM users WHERE id = ? AND role = 'user'
    ORDER BY created_at DESC;
  `,
    [user_id],
  );

  return rows;
};

exports.suspendUser = async (userId) => {
  await pool.query(
    `
    UPDATE users
    SET is_active = 0
    WHERE id = ?
  `,
    [userId],
  );
};

exports.activateUser = async (userId) => {
  await pool.query(
    `
    UPDATE users
    SET is_active = 1
    WHERE id = ?
  `,
    [userId],
  );
};

// workspaces
exports.getAllWorkspaces = async () => {
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

    WHERE u.role = 'user' 
    ORDER BY w.created_at DESC
  `;

  const [rows] = await pool.query(sql, [process.env.BASE_URL]);

  return rows;
};

exports.getWorkspaceDetails = async (workspaceId) => {
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

    WHERE u.role = 'user' AND w.id = ?
    ORDER BY w.created_at DESC
  `;

  const [rows] = await pool.query(sql, [process.env.BASE_URL, workspaceId]);

  return rows;
};

// tasks
exports.getAllTasks = async () => {
  const [rows] = await pool.query(`
    SELECT
        t.id,
        t.title,
        t.description,
        t.type,
        t.status,
        t.priority,
        t.start_date,
        t.end_date,
        t.created_at,

        tm.id AS team_id,
        tm.title AS team_name,
        tm.description AS team_description,

        u.id AS assigned_user_id,
        u.name AS assigned_user,
        u.avatar AS avatar

    FROM tasks t
    LEFT JOIN teams tm 
        ON tm.id = t.team_id

    LEFT JOIN users u 
        ON u.id = t.assigned_to
    ORDER BY t.created_at DESC;
      `);

  return rows;
};

exports.getTaskAnalytics = async () => {
  const [rows] = await pool.query(`
    SELECT status, COUNT(*) AS total
    FROM tasks
    GROUP BY status
  `);

  return rows;
};

//reports
exports.getDashboardStats = async () => {
  const [[users]] = await pool.query(`
    SELECT COUNT(*) AS total_users
    FROM users
  `);

  const [[workspaces]] = await pool.query(`
    SELECT COUNT(*) AS total_workspaces
    FROM workspaces
  `);

  const [[tasks]] = await pool.query(`
    SELECT COUNT(*) AS total_tasks
    FROM tasks
  `);

  const [[teams]] = await pool.query(`
    SELECT COUNT(*) AS total_teams
    FROM teams
  `);

  return {
    total_users: users.total_users,
    total_workspaces: workspaces.total_workspaces,
    total_teams: teams.total_teams,
    total_tasks: tasks.total_tasks,
  };
};

//teams
exports.getAllTeams = async () => {
  const sql = `
    SELECT
      t.id AS team_id,
      t.title,
      t.description,

      w.id AS workspace_id,
      w.name AS workspace_name,

      wm.role,

      u.id AS user_id,
      u.name,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS avatar

    FROM teams t

    JOIN workspaces w
      ON w.id = t.workspace_id

    LEFT JOIN team_members tm
      ON tm.team_id = t.id

    LEFT JOIN users u
      ON u.id = tm.user_id
    LEFT JOIN workspace_members wm
      ON wm.user_id = u.id
      AND wm.workspace_id = t.workspace_id
    WHERE u.role = 'user'
    ORDER BY t.created_at DESC
  `;

  const [rows] = await pool.query(sql, [process.env.BASE_URL]);

  return rows;
};

exports.getTeamById = async (team_id) => {
  const sql = `
    SELECT
      t.id AS team_id,
      t.title,
      t.description,

      w.id AS workspace_id,
      w.name AS workspace_name,

      wm.role,

      u.id AS user_id,
      u.name,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS avatar

    FROM teams t

    JOIN workspaces w
      ON w.id = t.workspace_id

    LEFT JOIN team_members tm
      ON tm.team_id = t.id

    LEFT JOIN users u
      ON u.id = tm.user_id
    LEFT JOIN workspace_members wm
      ON wm.user_id = u.id
      AND wm.workspace_id = t.workspace_id

    WHERE u.role = 'user' AND t.id = ?
    ORDER BY t.created_at DESC
  `;

  const [rows] = await pool.query(sql, [process.env.BASE_URL, team_id]);

  return rows;
};

exports.getTeamMembers = async (team_id) => {
  const sql = `
    SELECT
      t.id AS team_id,
      t.title,
      t.description,

      wm.role,

      u.id AS user_id,
      u.name,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS avatar

    FROM teams t


    LEFT JOIN team_members tm
      ON tm.team_id = t.id

    LEFT JOIN users u
      ON u.id = tm.user_id

    LEFT JOIN workspace_members wm
      ON wm.user_id = u.id
      AND wm.workspace_id = t.workspace_id

    WHERE u.role = 'user' AND t.id = ?
    ORDER BY t.created_at DESC
  `;

  const [rows] = await pool.query(sql, [process.env.BASE_URL, team_id]);

  return rows;
};

exports.getAllTeamActivity = async () => {
  let sql = `
    SELECT 
      ta.id,
      ta.team_id,
      t.title,
      ta.user_id,
      ta.action,
      ta.message,
      ta.created_at,

      w.id AS workspace_id,
      w.name AS workspace_name,

      u.id AS created_by_id,
      u.name AS created_by_name,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS created_by_avatar

    FROM team_activities ta
    JOIN users u ON u.id = ta.user_id
    JOIN teams t ON t.id = ta.team_id
    JOIN workspaces w ON w.id = t.workspace_id
    WHERE u.role = 'user'
    ORDER BY ta.created_at DESC
  `;

  const [rows] = await pool.query(sql, [process.env.BASE_URL]);

  return rows;
};
exports.getTeamActivityById = async (workspace_id, team_id, user_id) => {
  let sql = `
    SELECT 
      ta.id,
      ta.team_id,
      t.title,

      ta.user_id,
      ta.action,
      ta.message,
      ta.created_at,

      w.id AS workspace_id,
      w.name AS workspace_name,

      u.id AS created_by_id,
      u.name AS created_by_name,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS created_by_avatar

    FROM team_activities ta
    JOIN users u 
      ON u.id = ta.user_id
    JOIN teams t 
      ON t.id = ta.team_id
    JOIN workspaces w 
      ON w.id = t.workspace_id
    WHERE 
      ta.team_id = ?
      AND t.workspace_id = ?
    AND (
      EXISTS (
        SELECT 1 
        FROM workspace_members wm
        WHERE wm.user_id = ?
        AND wm.workspace_id = ?
        AND wm.role = 'owner'
      )
      OR EXISTS (
        SELECT 1
        FROM team_members tm
        WHERE tm.team_id = ta.team_id
        AND tm.user_id = ?
      )
    )
    ORDER BY ta.created_at DESC
  `;
  const [rows] = await pool.query(sql, [
    process.env.BASE_URL,
    team_id,
    workspace_id,
    user_id,
    workspace_id,
    user_id,
  ]);

  return rows;
};

exports.checkWorkspaceMember = async (workspace_id, user_id) => {
  const [rows] = await pool.query(
    `
      SELECT *
      FROM workspace_members
      WHERE workspace_id = ?
      AND user_id = ?
      LIMIT 1
    `,
    [workspace_id, user_id],
  );

  return rows[0];
};

exports.checkTeamInWorkspace = async (team_id, workspace_id) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM teams
    WHERE id = ?
    AND workspace_id = ?
    LIMIT 1
  `,
    [team_id, workspace_id],
  );

  return rows[0];
};

exports.getTaskActivityById = async (task_id) => {
  const sql = `
    SELECT 
      ta.id,
      ta.task_id,
      ta.user_id,
      ta.action,
      ta.message,
      ta.created_at,

      u.id AS created_by_id,
      u.name AS created_by_name,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS created_by_avatar

    FROM task_activities ta

    JOIN users u ON u.id = ta.user_id
    JOIN tasks t ON t.id = ta.task_id

    WHERE ta.task_id = ?

    ORDER BY ta.created_at DESC
  `;

  const [rows] = await pool.query(sql, [process.env.BASE_URL, task_id]);

  return rows;
};
