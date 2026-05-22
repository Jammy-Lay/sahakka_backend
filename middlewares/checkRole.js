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
      const user_id = req.user.id;
      const workspace_id = req.params.workspace_id;

      const row = await workspace.checkWorkspaceMember(user_id, workspace_id);

      if (!roles.includes(row[0].role)) {
        return res.status(403).json({
          result: false,
          message: "Permission denied",
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
};
