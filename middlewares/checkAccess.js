const workspace = require("../models/user/workspace");
const team = require("../models/user/team");

exports.checkAccess = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { workspace_id, team_id } = req.params;

    const checkWorkspace = await workspace.checkWorkspaceMember(user_id, workspace_id);

    if (checkWorkspace.length === 0) {
      return res.status(403).json({
        message: "You are not in this workspace",
      });
    }

    const checkTeam = await team.checkTeamInWorkspace(team_id, workspace_id);

    if (checkTeam.length === 0) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    const teamMember = await team.checkTeamMember(user_id, team_id);

    if (teamMember.length === 0) {
      return res.status(403).json({
        message: "You are not in this team",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
