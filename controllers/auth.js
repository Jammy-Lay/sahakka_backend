const auth = require("../services/auth");

exports.register = async (req, res) => {
  try {
    let result = await auth.register(req.validDate);

    return res.json({
      result: true,
      message: "Register Successfully",
      data: result[0],
    });
  } catch (err) {
    console.error(err);

    return res.status(err.status || 500).json({
      result: false,
      message: err.message || "Internal Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const row = await auth.login(req.validDate);
    return res.json({
      result: true,
      message: "Login Successfully",
      data: row[0],
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      result: false,
      message: err.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    let row = await auth.getMe(req.user.id);
    return res.json({
      result: true,
      message: "Get your info Successfully",
      data: row[0],
    });
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      result: false,
      message: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    await auth.logout(req.user.id);
    return res.json({
      result: true,
      message: "Logout Successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      result: false,
      message: err.message,
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    await auth.verifyEmail(req.query.token);
    return res.json({
      result: true,
      message: "Verify Email Successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      result: false,
      message: err.message,
    });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    await auth.resendVerificationEmail(req.body.email);
    return res.json({
      result: true,
      message: "Resend Link Successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      result: false,
      message: err.message,
    });
  }
};
