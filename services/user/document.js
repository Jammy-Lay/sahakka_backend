const document = require("../../models/user/document");

exports.getAllDocuments = async (workspace_id, team_id) => {
  return await document.getAllDocuments(workspace_id, team_id);
};

exports.getDocumentById = async (workspace_id, team_id, document_id) => {
  const rows = await document.getDocumentById(document_id);

  if (rows.length === 0) {
    throw new Error("Document not found");
  }

  const data = rows[0];

  return {
    document_id: data.id,
    title: data.title,
    content: data.content || "",
    created_at: data.created_at,

    created_by: {
      user_id: data.created_by_id,
      name: data.created_by_name,
      avatar: data.created_by_avatar,
    },
  };
};

exports.createDocument = async (team_id, body, user_id) => {
  const document_id = await document.createDocument(
    team_id,
    body.title,
    body.content || "",
    user_id,
  );

  return document_id;
};
