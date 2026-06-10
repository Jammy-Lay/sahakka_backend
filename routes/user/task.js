const express = require("express");
const router = express.Router();

const task = require("../../controllers/user/task");
const { isLogin } = require("../../middlewares/auth");
const { checkAccess } = require("../../middlewares/checkAccess");
const { checkWorkspaceRole } = require("../../middlewares/checkRole");
const { validate } = require("../../middlewares/validate");
const { createTaskSchema, updateTaskSchema } = require("../../validators/task");

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
  validate(createTaskSchema),
  task.createTask,
);

router.put(
  "/workspace/:workspace_id/team/:team_id/task/:task_id",
  isLogin,
  checkAccess,
  validate(updateTaskSchema),
  task.updateTask,
);

router.delete(
  "/workspace/:workspace_id/team/:team_id/task/:task_id",
  isLogin,
  checkAccess,
  checkWorkspaceRole(["owner"]),
  task.deleteTask,
);

router.get(
  "/workspace/:workspace_id/team/:team_id/task/:task_id/activities",
  isLogin,
  checkAccess,
  task.getTaskActivityById,
);

router.get(
  "/workspace/:workspace_id/team/:team_id/my-tasks/summary",
  isLogin,
  checkAccess,
  task.getMyTaskSummary,
);

router.get(
  "/workspace/:workspace_id/team/:team_id/my-tasks",
  isLogin,
  checkAccess,
  task.getMyTasks,
);

router.get(
  "/workspace/:workspace_id/team/:team_id/task/:task_id",
  isLogin,
  checkAccess,
  task.getTaskById,
);

module.exports = router;
