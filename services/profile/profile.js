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

  if (!user) {
    throw new Error("User not found");
  }

  const oldAvatar = user.avatar ? user.avatar.split("/").pop() : null;

  // already default
  if (oldAvatar === "default-avatar.png") {
    throw new Error("User already using default avatar");
  }

  // delete uploaded avatar from server
  if (oldAvatar) {
    const avatarPath = path.join(
      process.cwd(),
      "uploads",
      "avatars",
      oldAvatar,
    );

    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }
  }

  // update database back to default
  await profileModel.updateAvatar(userId, "default-avatar.png");

  return {
    message: "Avatar deleted successfully",
    avatar: `${process.env.BASE_URL}/uploads/avatars/default-avatar.png`,
  };
};

exports.changeAvatar = async (userId, file) => {
  if (!file) throw new Error("Please upload avatar");

  const uploadPath = path.join(process.cwd(), "uploads", "avatars");

  const allowedTypes = ["image/png", "image/jpeg"];

  if (!allowedTypes.includes(file.mimetype)) {
    const newFilePath = path.join(uploadPath, file.filename);

    if (fs.existsSync(newFilePath)) {
      fs.unlinkSync(newFilePath);
    }

    throw new Error("Only PNG and JPG/JPEG images are allowed");
  }

  const user = await profileModel.getUserById(userId);

  if (!user || user.length === 0) {
    const newFilePath = path.join(uploadPath, file.filename);

    if (fs.existsSync(newFilePath)) {
      fs.unlinkSync(newFilePath);
    }

    throw new Error("User not found");
  }

  // get old avatar name
  const oldAvatar = user.avatar ? user.avatar.split("/").pop() : null;

  try {
    // update database with new avatar
    await profileModel.updateAvatar(userId, file.filename);

    // delete old avatar only if NOT default
    if (oldAvatar && oldAvatar !== "default-avatar.png") {
      const oldAvatarPath = path.join(uploadPath, oldAvatar);

      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }
  } catch (error) {
    // remove uploaded file if database failed
    const newFilePath = path.join(uploadPath, file.filename);

    if (fs.existsSync(newFilePath)) {
      fs.unlinkSync(newFilePath);
    }

    throw new Error("Failed to update avatar");
  }

  return {
    message: "Avatar updated successfully",
    avatar: `${process.env.BASE_URL}/uploads/avatars/${file.filename}`,
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
