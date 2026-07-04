const profileService = require("../../services/profile/profile");
const team = require("../../services/user/team");
const { getIO } = require("../../configs/socket");

exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload image",
      });
    }

    const result = await profileService.uploadAvatar(userId, req.file);

    res.status(200).json({
      user_id: userId,
      message: "Upload success",
      avatarUrl: `${process.env.BASE_URL}/uploads/avatars/${result.avatar}`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await profileService.deleteAvatar(userId);

    const io = getIO();
    const coMembers = await team.getCoMembersOfUser(userId);
    coMembers.forEach((member) => {
      io.to(`user:${member}`).emit("profile-updated", {
        user_id: userId,
        avatar: result.avatar,
      });
    });
    io.to(`user:${userId}`).emit("profile-updated", {
      user_id: userId,
      avatar: result.avatar,
    });

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.changeAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await profileService.changeAvatar(userId, req.file);

    const io = getIO();
    const coMembers = await team.getCoMembersOfUser(userId);
    coMembers.forEach((member) => {
      io.to(`user:${member}`).emit("profile-updated", {
        user_id: userId,
        avatar: result.avatar,
      });
    });
    io.to(`user:${userId}`).emit("profile-updated", {
      user_id: userId,
      avatar: result.avatar,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      avatar: result.avatar,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.changeName = async (req, res) => {
  try {
    const userId = req.user.id;
    let result = await profileService.changeName(userId, req.validData.name);

    const io = getIO();
    const coMembers = await team.getCoMembersOfUser(userId);

    coMembers.forEach((member) => {
      io.to(`user:${member}`).emit("profile-updated", {
        user_id: userId,
        name: req.validData.name,
      });
    });
    io.to(`user:${userId}`).emit("profile-updated", {
      user_id: userId,
      name: req.validData.name,
    });

    res.status(200).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
