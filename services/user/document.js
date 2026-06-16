const document = require("../../models/user/document");

exports.getAllDocuments = async (workspace_id, team_id) => {
  const rows = await document.getAllDocuments(workspace_id, team_id);

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

exports.getDocumentById = async (workspace_id, team_id, document_id) => {
  const rows = await document.getDocumentById(
    workspace_id,
    team_id,
    document_id,
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

exports.createDocument = async (workspace_id, team_id, body, user_id) => {
  const document_id = await document.createDocument(
    team_id,
    body.title,
    user_id,
  );

  const rows = await document.getDocumentById(
    workspace_id,
    team_id,
    document_id,
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

exports.updateDocumentTitle = async (
  workspace_id,
  team_id,
  document_id,
  body,
  user_id,
) => {
  const rows = await document.getDocumentById(
    workspace_id,
    team_id,
    document_id,
  );

  if (rows.length === 0) {
    throw new Error("Document not found");
  }

  const result = await document.updateDocumentTitle(
    workspace_id,
    team_id,
    document_id,
    body.title,
    user_id,
  );

  if (result.affectedRows === 0) {
    throw new Error("You are not allowed");
  }
};

exports.updateDocumentContent = async (
  workspace_id,
  team_id,
  document_id,
  body,
  user_id,
) => {
  const rows = await document.getDocumentById(
    workspace_id,
    team_id,
    document_id,
  );

  if (rows.length === 0) {
    throw new Error("Document not found");
  }

  const result = await document.updateDocumentContent(
    workspace_id,
    team_id,
    document_id,
    body.content,
    user_id,
  );

  if (result.affectedRows === 0) {
    throw new Error("You are not allowed");
  }
};

exports.deleteDocument = async (workspace_id, team_id, document_id) => {
  const rows = await document.getDocumentById(
    workspace_id,
    team_id,
    document_id,
  );

  if (rows.length === 0) {
    throw new Error("Document not found");
  }

  const result = await document.deleteDocument(
    workspace_id,
    team_id,
    document_id,
  );

  if (result.affectedRows === 0) {
    throw new Error("Delete failed");
  }
};
