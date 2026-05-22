const pool = require("../../configs/db");

exports.getTasksByTeam = async (team_id, workspace_id) => {
  let sql = `
    SELECT
      t.id,
      t.title,
      t.description,
      t.type,
      t.status,
      t.priority,
      t.created_at,
      t.start_date,
      t.end_date,

      u1.name AS created_by_name,
      u2.name AS assigned_to_name

    FROM tasks t
    INNER JOIN teams tm ON tm.id = t.team_id

    LEFT JOIN users u1 ON u1.id = t.created_by
    LEFT JOIN users u2 ON u2.id = t.assigned_to

    WHERE t.team_id = ? AND tm.workspace_id = ?

    ORDER BY t.created_at DESC `;

  const [rows] = await pool.query(sql, [team_id, workspace_id]);
  return rows;
};

exports.createTask = async (team_id, body, user_id) => {
  let sql =
    "INSERT INTO tasks(team_id, title, description, type, status, priority, created_by, assigned_to, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  let [result] = await pool.query(sql, [
    team_id,
    body.title,
    body.description || null,
    body.type || "task",
    body.status || "todo",
    body.priority || "medium",
    user_id,
    body.assigned_to || null,
    body.start_date || null,
    body.end_date || null,
  ]);

  return result.insertId;
};

exports.findTaskById = async (task_id) => {
  let sql = `
    SELECT
      t.id,
      t.title,
      t.description,
      t.type,
      t.status,
      t.priority,
      t.created_at,
      t.start_date,
      t.end_date,

      u1.name AS created_by,
      u2.name AS assigned_to

    FROM tasks t
    LEFT JOIN users u1 ON u1.id = t.created_by
    LEFT JOIN users u2 ON u2.id = t.assigned_to

    WHERE t.id = ?
  `;

  const [row] = await pool.query(sql, [task_id]);
  return row;
};

exports.getTaskActivityById = async (task_id) => {
  let sql = `
    SELECT ta.*, u.name
    FROM task_activities ta
    JOIN users u ON u.id = ta.user_id
    WHERE ta.task_id = ?
    ORDER BY ta.created_at DESC`;

  const [rows] = await pool.query(sql, [task_id]);
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

  const result = await pool.query(sql, [task_id, user_id, action, message]);
  return result.insertId;
};
