const admin = require('../../services/admin/admin');
const teamService = require('../../services/user/team');
const workspaceService = require('../../services/user/workspace');
//dashboard

exports.dashboard = async (req, res) => {
    try {
        const stats = await admin.getDashboardStats();

        return res.status(200).json({
            result: true,
            data: stats
        });
    } catch (error) {
        return res.status(404).json({
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
        return res.status(404).json({
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

        return res.status(404).json({
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
        return res.status(409).json({
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
        return res.status(409).json({
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
            message: "Get workspaces successfully",
            data: workspaces
        });

    } catch (error) {

        return res.status(404).json({
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
        return res.status(404).json({
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
        return res.status(404).json({
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
        return res.status(404).json({
            result: false,
            message: error.message
        });
    }
};

exports.getTeams = async (req, res) => {
    try {

        const teams = await admin.getTeams();

        return res.status(200).json({
            result: true,
            message: "Get teams successfully",
            data: teams
        });

    } catch (error) {

        return res.status(404).json({
            result: false,
            message: error.message
        });

    }
};

exports.getTeamById = async (req, res) => {
    try {
        const { team_id } = req.params;
        const teams = await admin.getTeamById(team_id);

        return res.status(200).json({
            result: true,
            message: "Get teams successfully",
            data: teams
        });

    } catch (error) {

        return res.status(404).json({
            result: false,
            message: error.message
        });

    }
};

exports.getTeamMembers = async (req, res) => {
    try {
        const { team_id } = req.params;
        const teams = await admin.getTeamMembers(team_id);

        return res.status(200).json({
            result: true,
            message: "Get teams successfully",
            data: teams
        });

    } catch (error) {

        return res.status(404).json({
            result: false,
            message: error.message
        });

    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const analytics = await admin.getTaskAnalytics();

        return res.status(200).json({
            result: true,
            data: analytics
        });
    } catch (error) {
        return res.status(404).json({
            result: false,
            message: error.message
        });
    }
};

exports.getTeamActivityById = async (req, res) => {
    try {

        const { workspace_id, team_id } = req.params;

        const user_id = req.user.id;
        const role = req.user.role;

        if (role !== 'admin') {

            const member =
                await admin.checkWorkspaceMember(
                    workspace_id,
                    user_id
                );

            if (!member) {
                return res.status(403).json({
                    result: false,
                    message: "Access denied"
                });
            }

        }

        const team =
            await admin.checkTeamInWorkspace(
                team_id,
                workspace_id
            );

        if (!team) {
            return res.status(404).json({
                result: false,
                message: "Team not found"
            });
        }

        const rows =
            await admin.getTeamActivityById(team_id);

        return res.json({
            result: true,
            message: "Get Team Activity Successfully",
            data: rows,
        });

    } catch (error) {

        console.log(error);

        return res.status(404).json({
            result: false,
            message: error.message,
        });

    }

};

exports.getAllTeamActivity = async (req, res) => {
    try {

        const workspaces = await admin.getAllTeamActivity();

        return res.status(200).json({
            result: true,
            message: "Get workspaces successfully",
            data: workspaces
        });

    } catch (error) {

        return res.status(404).json({
            result: false,
            message: error.message
        });

    }
};

exports.getTaskActivities = async (req, res) => {
    // console.log(req.params); return;
    try {

        const {
            workspace_id,
            team_id,
            task_id
        } = req.params;

        const rows =
            await admin.getTaskActivities(task_id);

        return res.json({
            result: true,
            message: "Get Task Activity Successfully",
            data: rows
        });

    } catch (error) {

        console.log(error);

        return res.status(404).json({
            result: false,
            message: error.message
        });
    }
};