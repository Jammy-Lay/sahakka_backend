const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');

const profileController =require('../controllers/profile');

const authMiddleware = require('../middlewares/auth')

// upload avatar
router.post(
   '/upload-avatar',
   authMiddleware.isLogin,
   upload.uploadAvatar,
   profileController.uploadAvatar
);

// delete avatar
router.delete('/delete-avatar',authMiddleware.isLogin, profileController.deleteAvatar);

module.exports = router;