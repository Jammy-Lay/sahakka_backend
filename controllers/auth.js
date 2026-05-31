const auth = require("../services/auth");

exports.register = async (req, res) => {
  try {
    let result = await auth.register(req.validData);

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
    const row = await auth.login(req.validData);
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

exports.forgotPassword = async (req, res) => {
  try {
    let result = await auth.forgotPassword(req.body.email);

    res.json({
      message: "Request received",
      data: req.body,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      result: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    let result = await auth.resendOtp(req.body.email);

    res.json({
      message: "Request received",
      data: req.body,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      result: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    let result = await auth.verifyOtp(req.body.email, req.body.otp);

    res.json({
      message: "Verify Successfully",
    });
  } catch (error) {
    res.status(400).json({
      result: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let result = await auth.resetPassword(
      req.body.email,
      req.body.new_password,
      req.body.confirm_password,
    );

    res.json({
      message: result.message,
      data: req.body,
    });
  } catch (error) {
    res.status(400).json({
      result: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword, confirmPassword } = req.body;

    const result = await auth.changePassword(
      email,
      currentPassword,
      newPassword,
      confirmPassword,
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
