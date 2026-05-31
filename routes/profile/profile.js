const express = require("express");
const router = express.Router();

const upload = require("../../middlewares/upload");

const profileController = require("../../controllers/profile/profile");

const authMiddleware = require("../../middlewares/auth");

const { uploadLimiter } = require("../../middlewares/rateLimit");

// upload avatar
router.post(
  "/upload-avatar",
  authMiddleware.isLogin,
  uploadLimiter,
  upload.uploadAvatar,
  profileController.uploadAvatar,
);

// delete avatar
router.delete(
  "/delete-avatar",
  authMiddleware.isLogin,
  uploadLimiter,
  profileController.deleteAvatar,
);

// change avatar
router.put(
  "/change-avatar",
  authMiddleware.isLogin,
  uploadLimiter,
  upload.uploadAvatar,
  profileController.changeAvatar,
);

// change name
router.put(
  "/change-name",
  authMiddleware.isLogin,
  profileController.changeName,
);

module.exports = router;
