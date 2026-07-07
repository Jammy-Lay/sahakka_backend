const workspace = require("../models/user/workspace");

exports.checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

exports.checkWorkspaceRole = (roles) => {
  return async (req, res, next) => {
    try {
      let role = req.workspaceRole;

      if (!role) {
        const user_id = req.user.id;
        const workspace_id = req.params.workspace_id;

        const row = await workspace.checkWorkspaceMember(user_id, workspace_id);

        if (row.length === 0) {
          return res.status(403).json({
            message: "You are not in this workspace",
          });
        }

        role = row[0].role;        
        req.workspaceRole = role; 
      }

      if (!roles.includes(role)) {
        return res.status(403).json({
          message: "Permission denied only owner",
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  };
};
