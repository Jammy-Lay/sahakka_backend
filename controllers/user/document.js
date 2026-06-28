const document = require("../../services/user/document");
const { getIO } = require("../../configs/socket");

exports.getAllDocuments = async (req, res) => {
  try {
    const { workspace_id, team_id } = req.params;

    const rows = await document.getAllDocuments(team_id, workspace_id);

    return res.json({
      result: true,
      message: "Get all document successfully",
      data: rows,
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const { workspace_id, team_id, document_id } = req.params;

    const row = await document.getDocumentById(
      document_id,
      team_id,
      workspace_id,
    );

    return res.json({
      result: true,
      message: "Get document successfully",
      data: row,
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.createDocument = async (req, res) => {
  try {
    const { workspace_id, team_id } = req.params;
    const data = await document.createDocument(
      team_id,
      req.validData,
      req.user.id,
      workspace_id,
    );

    const io = getIO();
    io.to(`workspace:${workspace_id}:team:${team_id}`).emit(
      "document-created",
      data,
    );

    return res.json({
      result: true,
      message: "Document created successfully",
      data,
    });
  } catch (err) {
    return res.status(400).json({ result: false, message: err.message });
  }
};

exports.updateDocumentTitle = async (req, res) => {
  try {
    const { workspace_id, team_id, document_id } = req.params;
    await document.updateDocumentTitle(
      req.validData,
      document_id,
      team_id,
      workspace_id,
    );
    const row = await document.getDocumentById(
      document_id,
      team_id,
      workspace_id,
    );

    const io = getIO();
    io.to(`workspace:${workspace_id}:team:${team_id}`).emit(
      "document-updated",
      row,
    );

    return res.json({
      result: true,
      message: "Title updated successfully",
      data: row,
    });
  } catch (error) {
    return res.status(400).json({ result: false, message: error.message });
  }
};

exports.updateDocumentContent = async (req, res) => {
  try {
    const { workspace_id, team_id, document_id } = req.params;
    await document.updateDocumentContent(
      req.validData,
      document_id,
      team_id,
      workspace_id,
    );
    const row = await document.getDocumentById(
      document_id,
      team_id,
      workspace_id,
    );

    const io = getIO();
    io.to(`workspace:${workspace_id}:team:${team_id}`).emit(
      "document-updated",
      row,
    );

    return res.json({
      result: true,
      message: "Content updated successfully",
      data: row,
    });
  } catch (error) {
    return res.status(400).json({ result: false, message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { workspace_id, team_id, document_id } = req.params;
    await document.deleteDocument(document_id, team_id, workspace_id);

    const io = getIO();
    io.to(`workspace:${workspace_id}:team:${team_id}`).emit(
      "document-deleted",
      { document_id: Number(document_id) },
    );

    return res.json({ result: true, message: "Document deleted successfully" });
  } catch (error) {
    return res.status(400).json({ result: false, message: error.message });
  }
};
