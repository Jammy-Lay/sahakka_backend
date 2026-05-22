const invite = require("../../services/user/invite");
exports.createTokenInvite = async (req, res) => {
  try {
    const { workspace_id, team_id } = req.params;

    const result = await invite.createTokenInvite(workspace_id, team_id);

    return res.json({
      result: true,
      message: "Invite created",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      result: false,
      message: err.message,
    });
  }
};

exports.joinByToken = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await invite.joinByToken(req.body.token, user_id);

    return res.json({
      result: true,
      message: "Joined successfully",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      result: false,
      message: err.message,
    });
  }
};
