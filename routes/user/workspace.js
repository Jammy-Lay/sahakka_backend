const express = require("express");
const router = express.Router();

const workspace = require("../../controllers/user/workspace");
const { isLogin } = require("../../middlewares/auth");
const { checkWorkspaceRole } = require("../../middlewares/checkRole");
const { checkAccess } = require("../../middlewares/checkAccess");

const { validate } = require("../../middlewares/validate");
const {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  updateWorkspaceRoleSchema,
} = require("../../validators/workspaces");

router.post(
  "/create-workspace",
  isLogin,
  validate(createWorkspaceSchema),
  workspace.createWorkspace,
);

router.delete(
  "/workspace/:workspace_id",
  isLogin,
  checkWorkspaceRole(["owner"]),
  workspace.deleteWorkspace,
);

router.put(
  "/workspace/:workspace_id",
  isLogin,
  checkWorkspaceRole(["owner"]),
  validate(updateWorkspaceSchema),
  workspace.updateWorkspace,
);

router.get("/getMyWorkspace", isLogin, workspace.getMyWorkspace);

router.put(
  "/workspace/:workspace_id/team/:team_id/member/:user_id/role",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  validate(updateWorkspaceRoleSchema),
  workspace.updateMemberRole,
);

router.get(
  "/workspace/:workspace_id/members",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  workspace.getWorkspaceMembers,
);

router.delete(
  "/workspace/:workspace_id/member/:user_id",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  workspace.removeWorkspaceMember,
);

router.delete(
  "/workspace/:workspace_id/member/:user_id",
  isLogin,
  checkAccess,
  workspace.leaveWorkspace,
);

module.exports = router;
