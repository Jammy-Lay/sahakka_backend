const express = require('express');
const router = express.Router();

const admin = require('../../controllers/admin/admin');

const { isLogin } = require('../../middlewares/auth');
const { checkRole } = require('../../middlewares/checkRole');

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

module.exports = router;