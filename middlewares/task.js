const workspace = require("../models/user/workspace");
const team = require("../models/user/team");
const user = require("../models/users");

exports.validateCreateTask = async (req, res, next) => {
    try {
        const { workspace_id, team_id } = req.params;

        const checkWorkspace =
            await workspace.findWorkspaceById(workspace_id);

        if (checkWorkspace.length === 0) {
            throw new Error("Workspace not found");
        }

        const checkTeam =
            await team.findTeamById(team_id);

        if (checkTeam.length === 0) {
            throw new Error("Team not found");
        }

        next();
    } catch (err) {
        return res.status(400).json({
            result: false,
            message: err.message,
        });
    }
};

exports.validateAssignedUser = async (req, res, next) => {
    try {
        const { assigned_to } = req.validData;

        const checkUser =
            await user.getUserById(assigned_to);

        if (checkUser.length === 0) {
            throw new Error("Assigned user not found");
        }

        next();
    } catch (err) {
        return res.status(400).json({
            result: false,
            message: err.message,
        });
    }
};