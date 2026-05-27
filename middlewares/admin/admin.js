const db = require('../../configs/db');

exports.checkWorkspaceAccess = async (req, res, next) => {

    try {

        const { workspace_id } = req.params;
        const user = req.user;

        if (user.role === 'admin') {
            return next();
        }

        const [rows] = await db.query(
            `SELECT * FROM workspace_members
             WHERE workspace_id = ?
             AND user_id = ?`,
            [workspace_id, user.id]
        );

        if (rows.length === 0) {
            return res.status(403).json({
                result: false,
                message: "You are not in this workspace"
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            result: false,
            message: error.message
        });
    }
};