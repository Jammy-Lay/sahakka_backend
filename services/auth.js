const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { jwtConfig } = require("../configs/jwt");
const { sendVerificationEmail } = require("./mail/mailService");
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
  // console.log(isMatch);
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
