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
    const [rows] = await pool.query(`
    SELECT id, name, email, role, is_active, is_verified, created_at
    FROM users WHERE id = ? AND role = 'user'
    ORDER BY created_at DESC;
  `,[user_id]);

    return rows;
};

exports.suspendUser = async (userId) => {
    await pool.query(`
    UPDATE users
    SET is_active = 0
    WHERE id = ?
  `, [userId]);
};

exports.activateUser = async (userId) => {
    await pool.query(`
    UPDATE users
    SET is_active = 1
    WHERE id = ?
  `, [userId]);
};

exports.deleteUser = async (userId) => {
    await pool.query(`
    DELETE FROM users
    WHERE id = ?
  `, [userId]);
};


// workspaces
exports.getAllWorkspaces = async () => {
  const [rows] = await pool.query(`
    SELECT
      w.id,
      w.name,
      w.created_at,
      u.name AS owner_name
    FROM workspaces w
    JOIN users u ON w.owner_id = u.id
    ORDER BY w.created_at DESC
  `);

  return rows;
};

exports.getWorkspaceDetails = async (workspaceId) => {
  const [rows] = await pool.query(`
    SELECT *
    FROM workspaces
    WHERE id = ?
  `, [workspaceId]);

  return rows[0];
};

// tasks
exports.getAllTasks = async () => {
  const [rows] = await pool.query(`
    SELECT
      t.*,
      u.name AS assigned_user
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    ORDER BY t.created_at DESC
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

  return {
    total_users: users.total_users,
    total_workspaces: workspaces.total_workspaces,
    total_tasks: tasks.total_tasks
  };
};