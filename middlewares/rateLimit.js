const rateLimit = require("express-rate-limit");

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 300 requests
  message: {
    result: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.authLoginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: {
    result: false,
    message: "Too many login attempts",
  },
});

exports.authRegisterLimiter = rateLimit({
  windowMs: 5 * 60 * 60 * 1000, // 5h
  max: 5,
  message: {
    result: false,
    message: "Too many login attempts",
  },
});

exports.uploadLimiter = rateLimit({
  windowMs: 5 * 60 * 60 * 1000,
  max: 10,
  message: {
    result: false,
    message: "Too many uploads",
  },
});
