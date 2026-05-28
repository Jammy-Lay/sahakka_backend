const express = require('express');
const router = express.Router();

const admin = require('../../controllers/admin/admin');

const { isLogin } = require('../../middlewares/auth');
const { checkRole } = require('../../middlewares/checkRole');
const { checkWorkspaceAccess } = require('../../middlewares/admin/admin')

//dashboard

router.get(
    '/dashboard',
    isLogin,
    checkRole('admin'),
    admin.dashboard
);

//user

router.get(
    '/users',
    isLogin,
    checkRole('admin'),
    admin.getUsers
);


router.get(
    '/users/:id',
    isLogin,
    checkRole('admin'),
    admin.getUserById
);

router.patch(
    '/users/:id/suspend',
    isLogin,
    checkRole('admin'),
    admin.suspendUser
);

router.patch(
    '/users/:id/activate',
    isLogin,
    checkRole('admin'),
    admin.activateUser
);

router.delete(
    '/users/:id',
    isLogin,
    checkRole('admin'),
    admin.deleteUser
);

//workspace

router.get(
    '/workspaces',
    isLogin,
    checkRole('admin'),
    admin.getWorkspaces
);

router.get(
    '/workspaces/:id',
    isLogin,
    checkRole('admin'),
    admin.getWorkspaceDetails
);

//teams
router.get(
    '/teams',
    isLogin,
    checkRole('admin'),
    admin.getTeams
);
router.get(
    '/teams/:team_id',
    isLogin,
    checkRole('admin'),
    admin.getTeamById
);

router.get(
    '/teams_members/:team_id',
    isLogin,
    checkRole('admin'),
    admin.getTeamMembers
);
//task

router.get(
    '/tasks',
    isLogin,
    checkRole('admin'),
    admin.getTasks
);

router.get(
    '/tasks/analytics',
    isLogin,
    checkRole('admin'),
    admin.getTaskAnalytics
);

router.get(
    '/workspace/:workspace_id/activities/team/:team_id',
    isLogin,
    checkRole('admin'),
    admin.getTeamActivityById
);
router.get(
    '/workspace/:workspace_id/activities/teams',
    isLogin,
    checkRole('admin'),
    admin.getAllTeamActivity
);
router.get(
    '/workspace/:workspace_id/team/:team_id/task/:task_id/activities',
    isLogin,
    checkRole('admin'),
    // checkWorkspaceAccess,
    admin.getTaskActivities
);

module.exports = router;