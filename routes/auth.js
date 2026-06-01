const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth");
const { isLogin, checkActiveUser } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const { 
  registerUserSchema, 
  loginUserSchema, 
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} = require("../validators/user");
const { authLimiter } = require("../middlewares/rateLimit");

router.post(
  "/register",
  authLimiter,
  validate(registerUserSchema),
  auth.register,
);

router.post(
  "/login",
  authLimiter,
  validate(loginUserSchema),
  checkActiveUser,
  auth.login,
);

router.get("/getMe", isLogin, auth.getMe);
router.delete("/logout", isLogin, auth.logout);
router.get("/verify-email", auth.verifyEmail);
router.put("/resend", auth.resendVerificationEmail);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  auth.forgotPassword
);

router.post("/resend-otp", auth.resendOtp);
router.post(
  "/verify-otp", 
  validate(verifyOtpSchema),
  auth.verifyOtp
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  auth.resetPassword
);

router.post("/change-password", auth.changePassword);

module.exports = router;
