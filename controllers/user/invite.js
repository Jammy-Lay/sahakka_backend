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
    const result = await invite.joinByToken(req.validData.token, req.user);

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

exports.inviteByEmail = async (req, res) => {
  try {
    const { workspace_id, team_id } = req.params;
    const { email } = req.body;

    const result = await invite.inviteByEmail(
      workspace_id,
      team_id,
      email,
      req.user,
    );

    return res.json({
      result: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.query;

    const result = await invite.joinByToken(token, req.user);

    return res.json({
      result: true,
      message: "Invite accepted successfully",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      result: false,
      message: err.message,
    });
  }
};
