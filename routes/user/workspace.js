const express = require("express");
const router = express.Router();

const workspace = require("../../controllers/user/workspace");
const { isLogin } = require("../../middlewares/auth");
const { checkWorkspaceRole } = require("../../middlewares/checkRole");
const { checkAccess } = require("../../middlewares/checkAccess");

const { validate } = require('../../middlewares/validate');
const {
createWorkspaceSchema,
updateWorkspaceSchema,
workspaceIdSchema
} = require('../../validators/workspaces')


router.post(
  "/create-workspace", 
  isLogin,
  validate(createWorkspaceSchema),
  workspace.createWorkspace
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
  validate(workspaceIdSchema),
  workspace.updateMemberRole,
);

module.exports = router;
