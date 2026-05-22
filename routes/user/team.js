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

router.delete(
  "/workspace/:workspace_id/team/:team_id",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  team.deleteTeam,
);

router.put(
  "/workspace/:workspace_id/team/:team_id",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  team.updateTeam,
);

router.get("/workspace/:workspace_id/teams", isLogin, team.getTeamsByWorkspace);

router.get("/team/:team_id/sections", isLogin, team.getSectionsByTeam);

module.exports = router;
