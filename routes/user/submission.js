const express = require("express");
const router = express.Router();

const submission = require("../../controllers/user/submission");
const { isLogin } = require("../../middlewares/auth");
const { checkAccess } = require("../../middlewares/checkAccess");
const { checkWorkspaceRole } = require("../../middlewares/checkRole");
const { uploadSubmission } = require("../../middlewares/upload");
const { validateSubmitTask } = require("../../middlewares/validate");

router.post(
  "/workspace/:workspace_id/team/:team_id/task/:task_id/submit",
  isLogin,
  checkAccess,
  validateSubmitTask,
  uploadSubmission,
  submission.submitTask,
);

router.get(
  "/workspace/:workspace_id/team/:team_id/submissions",
  isLogin,
  checkAccess,
  checkWorkspaceRole("owner"),
  submission.getAllSubmissions,
);

router.put(
  "/workspace/:workspace_id/team/:team_id/submission/:submission_id/status",
  isLogin,
  checkAccess,
  checkWorkspaceRole("owner"),
  submission.updateSubmissionStatus,
);

module.exports = router;
