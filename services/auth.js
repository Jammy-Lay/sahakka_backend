const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { jwtConfig } = require("../configs/jwt");
const {
  sendVerificationEmail,
  sendResetPasswordOTP,
} = require("./mail/mailService");
const users = require("../models/users");
const workspace = require("../models/user/workspace");
const team = require("../models/user/team");

exports.register = async (body) => {
  let checkEmail = await users.findByEmail(body.email);
  // console.log(checkEmail);
  if (checkEmail.length > 0) {
    throw new Error("Email already registered");
  }

  let hashPassword = await bcrypt.hash(body.password, 10);
  // console.log(hashPassword);
  let verificationToken = crypto.randomBytes(32).toString("hex");
  // console.log(verificationToken); return;
  let verificationExpired = new Date(Date.now() + 60 * 60 * 1000); // 1hour

  const result = await users.register({
    name: body.name,
    email: body.email,
    password: hashPassword,
    verificationToken,
    verificationExpired,
  });

  await sendVerificationEmail(body.email, verificationToken);

  const row = await users.findById(result);

  return row;
};

exports.login = async (body) => {
  let userInfo = await users.findByEmail(body.email);
  // console.log(userInfo); return;
  if (userInfo.length === 0) {
    throw new Error("Email and Password are invalid");
  }
  let isMatch = await bcrypt.compare(body.password, userInfo[0].password);
  
  if (!isMatch) {
    throw new Error("Email and Password are invalid");
  }

  const token = jwt.sign(
    {
      id: userInfo[0].id,
      name: userInfo[0].name,
      email: userInfo[0].email,
      role: userInfo[0].role,
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expireIn },
  );

  // console.log(userInfo); return;

  if (!userInfo[0].is_verified) {
    throw new Error("Email not verify");
  }

  await users.addToken(token, userInfo[0].id);

  const row = await users.findById(userInfo[0].id);

  return row;
};

exports.getMe = async (id) => {
  const row = await users.getMe(id);
  return row;
};

exports.logout = async (id) => {
  const row = await users.removeToken(id);
  return row;
};

exports.verifyEmail = async (token) => {
  if (!token) {
    throw new Error("Token is required");
  }

  let userInfo = await users.findByVerificationToken(token);
  // console.log(userInfo);

  if (userInfo.length === 0) {
    throw new Error("Invalid Token");
  }

  if (userInfo[0].is_verified) {
    throw new Error("Email already verify");
  }

  if (!userInfo[0].verification_expires) {
    throw new Error("Token has no expiration date");
  }

  if (new Date(userInfo[0].verification_expires) < new Date()) {
    throw new Error("Token is expired");
  }

  await users.verifyEmail(userInfo[0].id);

  let owner_id = userInfo[0].id;
  const workspace_id = await workspace.createWorkspace(
    "My Workspace",
    owner_id,
  );

  let dataWorkspace = {
    workspace_id: workspace_id,
    user_id: owner_id,
    role: "owner",
  };

  await workspace.addWorkspaceMember(dataWorkspace);

  let dataTeam = {
    workspace_id: workspace_id,
    title: "My Team",
    description: "Teamwork",
  };

  const team_id = await team.defaultTeam(dataTeam);
  await team.addTeamMember(team_id, owner_id);
  await team.addTeamSection(team_id);
};

exports.resendVerificationEmail = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const userInfo = await users.findByEmail(email);
  // console.log(userInfo)
  if (userInfo.length === 0) {
    throw new Error("Invalid Email");
  }

  if (userInfo[0].is_verified) {
    throw new Error("Email already verify");
  }

  let verificationToken = crypto.randomBytes(32).toString("hex");
  let verificationExpired = new Date(Date.now() + 60 * 60 * 1000);

  await users.resendVerificationEmail({
    verificationToken,
    verificationExpired,
    id: userInfo[0].id,
  });

  await sendVerificationEmail(email, verificationToken);
};

exports.forgotPassword = async (email) => {
  let userInfo = await users.findByEmail(email);
  if (!userInfo || userInfo.length === 0) {
    throw new Error("OTP has been sent");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expire_at = new Date(Date.now() + 1 * 60 * 1000);

  const row = await users.checkUerSendOtp(email);

  if (row.length === 0) {
    await users.resetPassword(email, otp, expire_at);
  } else {
    await users.updateOtp(otp, expire_at, email);
  }

  await sendResetPasswordOTP(email, otp);
  return { message: "OTP has been sent" };
};

exports.resendOtp = async (email) => {
  const userInfo = await users.checkUerSendOtp(email);

  if (!userInfo || userInfo.length === 0) {
    throw new Error("OTP resent successfully");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expire_at = new Date(Date.now() + 5 * 60 * 1000);

  await users.updateOtp(otp, expire_at, email);

  await sendResetPasswordOTP(email, otp);

  return { message: "OTP resent successfully" };
};

exports.verifyOtp = async (email, otp) => {
  let userInfo = await users.checkUerSendOtp(email);
  // console.log(userInfo[0].otp.toString(), otp); return;

  if (!userInfo || userInfo.length === 0) {
    throw new Error("Invalid otp");
  }
  if (otp.toString() !== userInfo[0].otp.toString()) {
    throw new Error("Invalid otp");
  }
  if (userInfo[0].expire_at < new Date()) {
    throw new Error("OTP expired");
  }
 
  await users.VerificationOtp(userInfo[0].email);
};

exports.resetPassword = async (email, new_password, confirm_password) => {
  let userCheck = await users.checkUerSendOtp(email);
  // console.log(userCheck); return;
  if (!userCheck || userCheck.length === 0) {
    throw new Error("User not found");
  }
  if (new_password !== confirm_password) {
    throw new Error("Password not match");
  }
  if (!userCheck[0].verified) {
    throw new Error("No verify email");
  }

  let hashPassword = await bcrypt.hash(new_password, 10);
  // console.log(hashPassword); return;
  await users.changePassword(email, hashPassword);

  return { message: "Password updated successfully" };
};

exports.changePassword = async (
  email,
  currentPassword,
  newPassword,
  confirmPassword,
) => {
  const userInfo = await users.findByEmail(email);
  // console.log(userInfo); return;

  if (!userInfo || userInfo.length === 0) {
    throw new Error("User not found");
  }

  const user = userInfo[0];
  // console.log(user); return;

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Password not match");
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  await users.changePassword(user.email, hashPassword);

  return { message: "Password updated successfully" };
};
