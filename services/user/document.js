const xss = require("xss");
const document = require("../../models/user/document");

exports.getAllDocuments = async (workspace_id, team_id) => {
  await document.getAllDocuments(workspace_id, team_id);
};

exports.getDocumentById = async (document_id) => {
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
      user_id: data.user_id,
      name: data.created_by,
      avatar: data.avatar,
    },
  };
};

exports.createDocument = async (team_id, body, user_id) => {
  await document.createDocument(team_id, body.title, user_id);
};

exports.updateDocumentTitle = async (document_id, body) => {
  const rows = await document.getDocumentById(document_id);

  if (rows.length === 0) {
    throw new Error("Document not found");
  }

  await document.updateDocumentTitle(document_id, body.title);
};

exports.updateDocumentContent = async (document_id, body) => {
  const rows = await document.getDocumentById(document_id);

  if (rows.length === 0) {
    throw new Error("Document not found");
  }

  await document.updateDocumentContent(document_id, body.content);
};

exports.deleteDocument = async (document_id) => {
  const rows = await document.getDocumentById(document_id);

  if (rows.length === 0) {
    throw new Error("Document not found");
  }

  await document.deleteDocument(document_id);
};
