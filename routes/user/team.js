const express = require("express");
const router = express.Router();

const team = require("../../controllers/user/team");
const { isLogin } = require("../../middlewares/auth");
const { checkWorkspaceRole } = require("../../middlewares/checkRole");
const { checkAccess } = require("../../middlewares/checkAccess");

const { validate } = require('../../middlewares/validate');
const {
createTeamSchema,
updateTeamSchema,
teamIdSchema,
} = require('../../validators/team')

router.post(
  "/workspace/:workspace_id/create-workspace",
  isLogin,
  checkWorkspaceRole(["owner"]),
  validate(createTeamSchema),
  team.createTeam,
);

router.delete(
  "/workspace/:workspace_id/team/:team_id",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  validate(teamIdSchema),
  team.deleteTeam,
);

router.put(
  "/workspace/:workspace_id/team/:team_id",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  validate(updateTeamSchema),
  team.updateTeam,
);

router.get("/workspace/:workspace_id/teams", isLogin, team.getTeamsByWorkspace);

router.get("/team/:team_id/sections", isLogin, team.getSectionsByTeam);

router.get(
  "/workspace/:workspace_id/team/:team_id/activities",
  isLogin,
  checkAccess,
  team.getTeamActivityById,
);

router.delete(
  "/workspace/:workspace_id/team/:team_id/member/:user_id",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  validate(teamIdSchema),
  team.removeTeamMember,
);

module.exports = router;
