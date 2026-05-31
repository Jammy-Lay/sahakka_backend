const express = require("express");
const router = express.Router();

const workspace = require("../../controllers/user/workspace");
const { isLogin } = require("../../middlewares/auth");
const { checkWorkspaceRole } = require("../../middlewares/checkRole");
const { checkAccess } = require("../../middlewares/checkAccess");

router.post("/create-workspace", isLogin, workspace.createWorkspace);

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
  workspace.updateWorkspace,
);

router.get("/getMyWorkspace", isLogin, workspace.getMyWorkspace);

router.put(
  "/workspace/:workspace_id/team/:team_id/member/:user_id/role",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  workspace.updateMemberRole,
);

module.exports = router;
