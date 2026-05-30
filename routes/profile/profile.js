const express = require('express');
const router = express.Router();

const upload = require('../../middlewares/upload');

const profileController = require('../../controllers/profile/profile');

const authMiddleware = require('../../middlewares/auth')

// upload avatar
router.post(
   '/upload-avatar',
   authMiddleware.isLogin,
   upload.uploadAvatar,
   profileController.uploadAvatar
);

// delete avatar
router.delete('/delete-avatar', authMiddleware.isLogin, profileController.deleteAvatar);

// change avatar
router.put(
   "/change-avatar",
   authMiddleware.isLogin,
   upload.uploadAvatar,
   profileController.changeAvatar
);

// change name
router.put('/change-name', authMiddleware.isLogin, profileController.changeName)

module.exports = router;