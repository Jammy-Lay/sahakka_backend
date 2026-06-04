const express = require("express");
const router = express.Router();

const submission = require("../../controllers/user/submission");
const { isLogin } = require("../../middlewares/auth");
const { checkAccess } = require("../../middlewares/checkAccess");
const { checkWorkspaceRole } = require("../../middlewares/checkRole");
const { uploadSubmission } = require("../../middlewares/upload");
const { validateSubmitTask, validate } = require("../../middlewares/validate");
const { uploadLimiter } = require("../../middlewares/rateLimit");
const {
  submitTaskSchema,
  updateSubmissionStatusSchema,
} = require("../../validators/submission");

router.post(
  "/workspace/:workspace_id/team/:team_id/task/:task_id/submit",
  isLogin,
  uploadLimiter,
  checkAccess,
  validateSubmitTask,
  validate(submitTaskSchema),
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
  validate(updateSubmissionStatusSchema),
  submission.updateSubmissionStatus,
);

module.exports = router;
