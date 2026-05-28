const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../configs/jwt");
const { findByToken,findByEmail } = require("../models/users");

exports.isLogin = async (req, res, next) => {
  // console.log(req.headers); return;
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        result: false,
        message: "You need to login",
      });
    }
    let parts = authHeader.split(" ");
    // console.log(parts);
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        result: false,
        message: "Invalid token",
      });
    }

    let token = parts[1];

    const decode = jwt.verify(token, jwtConfig.secret);
    let userInfo = await findByToken(token);
    if (userInfo.length === 0) {
      throw new Error("Invalid or Expired Token");
    }

    req.user = decode;
    next();
  } catch (err) {
    // console.log(err);
    return res.status(401).json({
      result: false,
      message: "Invalid or Expired Token",
    });
  }
};

exports.checkActiveUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await findByEmail(email);

    if (user.length > 0 && user[0].is_active !== 1) {
      return res.status(403).json({
        result: false,
        message: "Your account has been blocked by admin",
      });
    }

    next();

  } catch (err) {
    return res.status(500).json({
      result: false,
      message: "Server Error",
    });
  }
};