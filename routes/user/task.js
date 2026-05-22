const express = require("express");
const router = express.Router();

const task = require("../../controllers/user/task");
const { isLogin } = require("../../middlewares/auth");
const { checkAccess } = require("../../middlewares/checkAccess");

router.get(
  "/workspace/:workspace_id/team/:team_id/tasks",
  isLogin,
  checkAccess,
  task.getTasksByTeam,
);

router.post(
  "/workspace/:workspace_id/team/:team_id/task",
  isLogin,
  checkAccess,
  task.createTask,
);

router.get(
  "/workspace/:workspace_id/team/:team_id/task/:task_id/activities",
  isLogin,
  checkAccess,
  task.getTaskActivityById,
);

module.exports = router;
