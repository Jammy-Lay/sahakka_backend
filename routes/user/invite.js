const express = require("express");
const router = express.Router();

const invite = require("../../controllers/user/invite");
const { isLogin } = require("../../middlewares/auth");
const { checkAccess } = require("../../middlewares/checkAccess");
const { checkWorkspaceRole } = require("../../middlewares/checkRole");

router.post(
  "/workspace/:workspace_id/team/:team_id/invite",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  invite.createTokenInvite,
);

router.post("/invite/join", isLogin, invite.joinByToken);

router.post(
  "/workspace/:workspace_id/team/:team_id/invite/email",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  invite.inviteByEmail,
);

router.get("/invite/accept", isLogin, invite.acceptInvite);

module.exports = router;
