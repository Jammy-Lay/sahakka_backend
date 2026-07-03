const pool = require("../../configs/db");

exports.getTasksByTeam = async (team_id, workspace_id, status = null) => {
  let sql = `
    SELECT
      t.id,
      t.team_id,
      t.title,
      t.description,
      t.type,
      t.status,
      t.priority,
      t.created_at,
      t.start_date,
      t.end_date,

      u1.id AS created_by_id,
      u1.name AS created_by_name,
      CONCAT(?, '/uploads/avatars/', u1.avatar) AS created_by_avatar,

      u2.id AS assigned_to_id,
      u2.name AS assigned_to_name,
      CONCAT(?, '/uploads/avatars/', u2.avatar) AS assigned_to_avatar,

      u3.id AS assigned_by_id,
      u3.name AS assigned_by_name,
      CONCAT(?, '/uploads/avatars/', u3.avatar) AS assigned_by_avatar

    FROM tasks t

    INNER JOIN teams tm
      ON tm.id = t.team_id

    LEFT JOIN users u1
      ON u1.id = t.created_by

    LEFT JOIN users u2
      ON u2.id = t.assigned_to

    LEFT JOIN users u3
      ON u3.id = t.assigned_by

    WHERE
      t.team_id = ?
      AND tm.workspace_id = ? `;

  const params = [
    process.env.BASE_URL,
    process.env.BASE_URL,
    process.env.BASE_URL,
    team_id,
    workspace_id,
  ];

  if (status) {
    sql += ` AND t.status = ? `;
    params.push(status);
  }

  sql += ` ORDER BY t.created_at DESC `;

  const [rows] = await pool.query(sql, params);

  return rows;
};

exports.createTask = async (team_id, body, user_id) => {
  let sql = `
    INSERT INTO tasks(
      team_id,
      title,
      description,
      type,
      status,
      priority,
      created_by,
      assigned_to,
      assigned_by,
      start_date,
      end_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  let [result] = await pool.query(sql, [
    team_id,
    body.title,
    body.description || null,
    body.type || "task",
    body.status || "todo",
    body.priority || "medium",
    user_id,
    body.assigned_to || null,
    body.assigned_to ? user_id : null,
    body.start_date || null,
    body.end_date || null,
  ]);

  return result.insertId;
};

exports.updateTask = async (task_id, body) => {
  const sql = `
    UPDATE tasks SET
      title= ?,
      description= ?,
      type = ?,
      status = ?,
      priority = ?,
      assigned_to = ?,
      assigned_by = ?,
      start_date = ?,
      end_date = ?
    WHERE id = ?
  `;

  await pool.query(sql, [
    body.title,
    body.description,
    body.type,
    body.status,
    body.priority,
    body.assigned_to,
    body.assigned_by,
    body.start_date,
    body.end_date,
    task_id,
  ]);
};

exports.findTaskById = async (task_id) => {
  const sql = `
    SELECT
      t.id,
      t.team_id,
      t.title,
      t.description,
      t.type,
      t.status,
      t.priority,
      t.created_at,
      t.start_date,
      t.end_date,

      u1.id AS created_by_id,
      u1.name AS created_by_name,
      CONCAT(?, '/uploads/avatars/', u1.avatar) AS created_by_avatar,

      u2.id AS assigned_to_id,
      u2.name AS assigned_to_name,
      CONCAT(?, '/uploads/avatars/', u2.avatar) AS assigned_to_avatar,

      u3.id AS assigned_by_id,
      u3.name AS assigned_by_name,
      CONCAT(?, '/uploads/avatars/', u3.avatar) AS assigned_by_avatar

    FROM tasks t

    LEFT JOIN users u1
      ON u1.id = t.created_by

    LEFT JOIN users u2
      ON u2.id = t.assigned_to

    LEFT JOIN users u3
      ON u3.id = t.assigned_by

    WHERE t.id = ?
  `;

  const [rows] = await pool.query(sql, [
    process.env.BASE_URL,
    process.env.BASE_URL,
    process.env.BASE_URL,
    task_id,
  ]);

  return rows;
};

exports.getTaskActivityById = async (task_id) => {
  let sql = `
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
    WHERE ta.task_id = ?
    ORDER BY ta.created_at DESC
  `;

  const [rows] = await pool.query(sql, [process.env.BASE_URL, task_id]);

  return rows;
};

exports.checkTaskInTeam = async (task_id, team_id) => {
  let sql = "SELECT id FROM tasks WHERE id = ? AND team_id = ?";
  const [row] = await pool.query(sql, [task_id, team_id]);
  return row;
};

exports.createTaskActivity = async (task_id, user_id, action, message) => {
  let sql =
    "INSERT INTO task_activities (task_id, user_id, action, message) VALUES (?, ?, ?, ?)";

  const [result] = await pool.query(sql, [task_id, user_id, action, message]);
  return result.insertId;
};

exports.updateStatus = async (status, task_id) => {
  let sql = "UPDATE tasks SET status = ? WHERE id = ?";
  await pool.query(sql, [status, task_id]);
};

exports.createDefaultTask = async (team_id, user_id) => {
  let sql =
    "INSERT INTO tasks (team_id, title, description, created_by) VALUES (?, ?, ?, ?)";

  const [result] = await pool.query(sql, [
    team_id,
    "Welcome to Sahakka",
    "Create your first task and invite your teammates.",
    user_id,
  ]);

  return result.insertId;
};

exports.deleteTask = async (task_id) => {
  let sql = "DELETE FROM tasks WHERE id = ?";
  await pool.query(sql, [task_id]);
};

exports.getMyTaskSummary = async (workspace_id, team_id, user_id) => {
  const sql = `
    SELECT
      COUNT(*) AS total_tasks,

      COALESCE(SUM(status = 'todo'), 0) AS todo,
      COALESCE(SUM(status = 'in_progress'), 0) AS in_progress,
      COALESCE(SUM(status = 'submitted'), 0) AS submitted,
      COALESCE(SUM(status = 'approved'), 0) AS approved,
      COALESCE(SUM(status = 'rejected'), 0) AS rejected,

      COALESCE(SUM(priority = 'urgent'), 0) AS urgent,
      COALESCE(SUM(priority = 'high'), 0) AS high,
      COALESCE(SUM(priority = 'medium'), 0) AS medium,
      COALESCE(SUM(priority = 'low'), 0) AS low

    FROM tasks t
    JOIN teams tm ON tm.id = t.team_id

    WHERE
      tm.workspace_id = ?
      AND t.team_id = ?
      AND t.assigned_to = ? `;

  const [rows] = await pool.query(sql, [workspace_id, team_id, user_id]);

  return rows[0];
};

exports.getMyTasks = async (workspace_id, team_id, user_id, status = null) => {
  let sql = `
    SELECT
      t.id,
      t.team_id,
      t.title,
      t.description,
      t.type,
      t.status,
      t.priority,
      t.created_at,
      t.start_date,
      t.end_date,


      u1.id AS created_by_id,
      u1.name AS created_by_name,
      CONCAT(?, '/uploads/avatars/', u1.avatar) AS created_by_avatar,


      u2.id AS assigned_to_id,
      u2.name AS assigned_to_name,
      CONCAT(?, '/uploads/avatars/', u2.avatar) AS assigned_to_avatar,


      u3.id AS assigned_by_id,
      u3.name AS assigned_by_name,
      CONCAT(?, '/uploads/avatars/', u3.avatar) AS assigned_by_avatar


    FROM tasks t


    JOIN teams tm
      ON tm.id = t.team_id


    LEFT JOIN users u1
      ON u1.id = t.created_by


    LEFT JOIN users u2
      ON u2.id = t.assigned_to


    LEFT JOIN users u3
      ON u3.id = t.assigned_by


    WHERE
      tm.workspace_id = ?
      AND t.team_id = ?
      AND t.assigned_to = ? `;

  const params = [
    process.env.BASE_URL,
    process.env.BASE_URL,
    process.env.BASE_URL,
    workspace_id,
    team_id,
    user_id,
  ];

  if (status) {
    sql += ` AND t.status = ? `;
    params.push(status);
  }

  sql += ` ORDER BY t.created_at DESC `;

  const [rows] = await pool.query(sql, params);

  return rows;
};

exports.getTaskById = async (workspace_id, team_id, task_id) => {
  const sql = `
    SELECT
      t.id,
      t.team_id,
      t.title,
      t.description,
      t.type,
      t.status,
      t.priority,
      t.created_at,
      t.start_date,
      t.end_date,

      u1.id AS created_by_id,
      u1.name AS created_by_name,
      CONCAT(?, '/uploads/avatars/', u1.avatar) AS created_by_avatar,

      u2.id AS assigned_to_id,
      u2.name AS assigned_to_name,
      CONCAT(?, '/uploads/avatars/', u2.avatar) AS assigned_to_avatar,

      u3.id AS assigned_by_id,
      u3.name AS assigned_by_name,
      CONCAT(?, '/uploads/avatars/', u3.avatar) AS assigned_by_avatar

    FROM tasks t

    JOIN teams tm
      ON tm.id = t.team_id

    LEFT JOIN users u1
      ON u1.id = t.created_by

    LEFT JOIN users u2
      ON u2.id = t.assigned_to

    LEFT JOIN users u3
      ON u3.id = t.assigned_by

    WHERE
      t.id = ?
      AND t.team_id = ?
      AND tm.workspace_id = ?

    LIMIT 1
  `;

  const [rows] = await pool.query(sql, [
    process.env.BASE_URL,
    process.env.BASE_URL,
    process.env.BASE_URL,
    task_id,
    team_id,
    workspace_id,
  ]);

  return rows;
};
