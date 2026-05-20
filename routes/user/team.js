const express = require("express");
const router = express.Router();

const team = require("../../controllers/user/team");
const { isLogin } = require("../../middlewares/auth");
const { checkWorkspaceRole } = require("../../middlewares/checkRole");
const { checkAccess } = require("../../middlewares/checkAccess");

router.post(
  "/workspace/:workspace_id/create-workspace",
  isLogin,
  checkWorkspaceRole(["owner"]),
  team.createTeam,
);

router.get(
  "/workspace/:workspace_id/teams",
  isLogin,
  checkWorkspaceRole(["owner"]),
  team.getTeamsByWorkspace,
);

module.exports = router;
