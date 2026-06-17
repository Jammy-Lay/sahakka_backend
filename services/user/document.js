const document = require("../../models/user/document");

exports.createDocument = async (team_id, body, user_id, workspace_id) => {
  const document_id = await document.createDocument(
    team_id,
    body.title,
    user_id,
  );

  const rows = await document.getDocumentById(
    document_id,
    team_id,
    workspace_id,
  );

  if (rows.length === 0) {
    throw new Error("Document not found after create");
  }

  const data = rows[0];

  return {
    document_id: data.id,
    title: data.title,
    content: data.content || "",
    created_at: data.created_at,

    created_by: {
      user_id: data.user_id,
      name: data.created_by,
      avatar: data.avatar,
    },
  };
};

exports.getAllDocuments = async (team_id, workspace_id) => {
  const rows = await document.getAllDocuments(team_id, workspace_id);

  if (rows.length === 0) {
    return [];
  }

  return rows.map((item) => ({
    document_id: item.id,
    title: item.title,
    created_at: item.created_at,

    created_by: {
      user_id: item.user_id,
      name: item.created_by,
      avatar: item.avatar,
    },
  }));
};

exports.getDocumentById = async (document_id, team_id, workspace_id) => {
  const rows = await document.getDocumentById(
    document_id,
    team_id,
    workspace_id,
  );

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
      user_id: data.user_id,
      name: data.created_by,
      avatar: data.avatar,
    },
  };
};

exports.updateDocumentTitle = async (
  body,
  document_id,
  team_id,
  workspace_id,
) => {
  const rows = await document.findDocumentById(
    document_id,
    team_id,
    workspace_id,
  );

  if (rows.length === 0) {
    throw new Error("Document not found");
  }

  await document.updateDocumentTitle(
    body.title,
    document_id,
    team_id,
    workspace_id,
  );
};

exports.updateDocumentContent = async (
  body,
  document_id,
  team_id,
  workspace_id,
) => {
  const rows = await document.findDocumentById(
    document_id,
    team_id,
    workspace_id,
  );

  if (rows.length === 0) {
    throw new Error("Document not found");
  }

  await document.updateDocumentContent(
    body.content,
    document_id,
    team_id,
    workspace_id,
  );
};

exports.deleteDocument = async (document_id, team_id, workspace_id) => {
  const rows = await document.findDocumentById(
    document_id,
    team_id,
    workspace_id,
  );

  if (rows.length === 0) {
    throw new Error("Document not found");
  }

  const result = await document.deleteDocument(
    document_id,
    team_id,
    workspace_id,
  );

  if (result.affectedRows === 0) {
    throw new Error("Delete failed");
  }
};
