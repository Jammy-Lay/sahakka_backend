const pool = require("../../configs/db");

exports.getAllDocuments = async (workspace_id, team_id) => {
  const sql = `
    SELECT
      d.id,
      d.title,
      d.created_at,

      u.id AS user_id,
      u.name AS created_by,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS avatar

    FROM documents d
    INNER JOIN teams t ON t.id = d.team_id
    LEFT JOIN users u ON u.id = d.created_by

    WHERE d.team_id = ?
    AND t.workspace_id = ?

    ORDER BY d.created_at DESC `;

  const [rows] = await pool.query(sql, [
    process.env.BASE_URL,
    team_id,
    workspace_id,
  ]);

  return rows;
};

exports.getDocumentById = async (workspace_id, team_id, document_id) => {
  const sql = `
    SELECT
      d.id,
      d.title,
      d.created_at,

      b.content,

      u.id AS user_id,
      u.name AS created_by,
      CONCAT(?, '/uploads/avatars/', u.avatar) AS avatar


    FROM documents d


    INNER JOIN teams t
      ON t.id = d.team_id


    LEFT JOIN document_blocks b
      ON b.document_id = d.id


    LEFT JOIN users u
      ON u.id = d.created_by


    WHERE
      d.id = ?
      AND d.team_id = ?
      AND t.workspace_id = ?
  `;

  const [rows] = await pool.query(sql, [
    process.env.BASE_URL,
    document_id,
    team_id,
    workspace_id,
  ]);

  return rows;
};

exports.createDocument = async (team_id, title, user_id) => {
  const sql =
    "INSERT INTO documents (team_id, title, created_by) VALUES (?, ?, ?)";

  const [result] = await pool.query(sql, [team_id, title, user_id]);

  const document_id = result.insertId;

  await pool.query(
    "INSERT INTO document_blocks (document_id, content) VALUES (?, '')",
    [document_id],
  );

  return document_id;
};

exports.deleteDocument = async (document_id) => {
  await pool.query("DELETE FROM documents WHERE id = ?", [document_id]);
};

exports.updateDocumentTitle = async (document_id, title) => {
  const sql = "UPDATE documents SET title = ? WHERE id = ?";

  await pool.query(sql, [title, document_id]);
};

exports.updateDocumentContent = async (document_id, content) => {
  const sql = "UPDATE document_blocks SET content = ? WHERE document_id = ?";

  await pool.query(sql, [content, document_id]);
};
