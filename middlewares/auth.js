const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../configs/jwt");
const { findByToken } = require("../models/users");

exports.isLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
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
    // console.log(decode);
    let userInfo = await findByToken(token);
    if (userInfo.length === 0) {
      throw new Error("Invalid or Expired Token");
    }

    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      result: false,
      message: "Invalid or Expired Token",
    });
  }
};