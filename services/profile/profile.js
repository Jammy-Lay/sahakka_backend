const fs = require("fs");
const path = require("path");

const profileModel = require("../../models/profile/profile");
const auth = require("../../models/users");

exports.uploadAvatar = async (userId, file) => {
  const user = await profileModel.getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // delete old avatar
  if (user.avatar !== "default-avatar.png") {
    const oldPath = path.join(__dirname, "../uploads/avatars", user.avatar);

    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  // update database
  await profileModel.updateAvatar(userId, file.filename);

  return {
    message: "Avatar uploaded successfully",
    avatar: file.filename,
  };
};

exports.deleteAvatar = async (userId) => {
  const user = await profileModel.getUserById(userId);
  if (user.avatar === "default-avatar.png") {
    throw new Error("User already using default avatar");
  }

  if (!user) {
    throw new Error("User not found");
  }

  // delete uploaded avatar
  if (user.avatar !== "default-avatar.png") {
    const avatarPath = path.join(__dirname, "../uploads/avatars", user.avatar);

    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }
  }

  // back to default
  await profileModel.updateAvatar(userId, "default-avatar.png");

  return {
    message: "Avatar deleted successfully",
  };
};

exports.changeAvatar = async (userId, file) => {
  if (!file) {
    throw new Error("Please upload avatar");
  }

  const user = await profileModel.getUserById(userId);

  if (!user || user.length === 0) {
    throw new Error("User not found");
  }

  const oldAvatar = user.avatar;

  // Update database first
  await profileModel.updateAvatar(userId, file.filename);

  // Remove old avatar after successful DB update
  if (oldAvatar) {
    const oldPath = path.join(process.cwd(), "uploads", "avatars", oldAvatar);

    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  return {
    message: "Avatar updated successfully",
    avatar: file.filename,
  };
};
exports.changeName = async (user_id, name) => {
  const user = await auth.findById(user_id);
  if (!user) {
    throw new Error("User not found");
  }

  await profileModel.changeName(user_id, name);

  return {
    message: "Name changed successfully",
  };
};
