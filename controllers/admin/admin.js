const admin = require('../../services/admin/admin');

//dashboard

exports.dashboard = async (req, res) => {
    try {
        const stats = await admin.getDashboardStats();

        return res.status(200).json({
            result: true,
            data: stats
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: error.message
        });
    }
};

//users

exports.getUsers = async (req, res) => {
    try {
        const users = await admin.getUsers();

        return res.status(200).json({
            result: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: error.message
        });
    }
};

exports.getUserById = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await admin.getUserById(id);

        if (!user) {
            return res.status(404).json({
                result: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            result: true,
            data: user
        });

    } catch (error) {

        return res.status(500).json({
            result: false,
            message: error.message
        });

    }
};

exports.suspendUser = async (req, res) => {
    try {
        const { id } = req.params;

        await admin.suspendUser(id);

        return res.status(200).json({
            result: true,
            message: 'User suspended successfully'
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: error.message
        });
    }
};

exports.activateUser = async (req, res) => {
    try {
        const { id } = req.params;

        await admin.activateUser(id);

        return res.status(200).json({
            result: true,
            message: 'User activated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await admin.deleteUser(id);

        return res.status(200).json({
            result: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: error.message
        });
    }
};

// workspace

exports.getWorkspaces = async (req, res) => {
    try {
        const workspaces = await admin.getWorkspaces();

        return res.status(200).json({
            result: true,
            data: workspaces
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: error.message
        });
    }
};

exports.getWorkspaceDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const workspace = await admin.getWorkspaceDetails(id);

        return res.status(200).json({
            result: true,
            data: workspace
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: error.message
        });
    }
};

///task

exports.getTasks = async (req, res) => {
    try {
        const tasks = await admin.getTasks();

        return res.status(200).json({
            result: true,
            data: tasks
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: error.message
        });
    }
};

exports.getTaskAnalytics = async (req, res) => {
    try {
        const analytics = await admin.getTaskAnalytics();

        return res.status(200).json({
            result: true,
            data: analytics
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: error.message
        });
    }
};