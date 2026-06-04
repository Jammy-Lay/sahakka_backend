const express = require("express");
const router = express.Router();

const document = require("../../controllers/user/document");
const { isLogin } = require("../../middlewares/auth");
const { checkAccess } = require("../../middlewares/checkAccess");
const { checkWorkspaceRole } = require("../../middlewares/checkRole");
const { validate } = require("../../middlewares/validate");
const {
  createDocumentSchema,
  updateDocumentTitleSchema,
} = require("../../validators/document");

router.post(
  "/workspace/:workspace_id/team/:team_id/document",
  isLogin,
  checkAccess,
  validate(createDocumentSchema),
  document.createDocument,
);

router.get(
  "/workspace/:workspace_id/team/:team_id/documents",
  isLogin,
  checkAccess,
  document.getAllDocuments,
);

router.get(
  "/workspace/:workspace_id/team/:team_id/document/:document_id",
  isLogin,
  checkAccess,
  document.getDocumentById,
);

router.put(
  "/workspace/:workspace_id/team/:team_id/document/:document_id/title",
  isLogin,
  checkAccess,
  validate(updateDocumentTitleSchema),
  document.updateDocumentTitle,
);

router.put(
  "/workspace/:workspace_id/team/:team_id/document/:document_id/content",
  isLogin,
  checkAccess,
  document.updateDocumentContent,
);

router.delete(
  "/workspace/:workspace_id/team/:team_id/document/:document_id",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  document.deleteDocument,
);

module.exports = router;
