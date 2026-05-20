const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth");
const { isLogin } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const { registerUserSchema, loginUserSchema } = require("../validators/user");

router.post("/register", validate(registerUserSchema), auth.register);
router.post("/login", validate(loginUserSchema), auth.login);
router.get("/getMe", isLogin, auth.getMe);
router.delete("/logout", isLogin, auth.logout);
router.get("/verify-email", auth.verifyEmail);
router.put("/resend", auth.resendVerificationEmail);

module.exports = router;
