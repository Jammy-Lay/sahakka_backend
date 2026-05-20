const pool = require("../configs/db");

exports.findByEmail = async (email) => {
  let sql =
    "SELECT id, name, email, password, role, is_verified FROM users WHERE email = ?";
  let [row] = await pool.query(sql, [email]);
  return row;
};

exports.findById = async (id) => {
  let sql =
    "SELECT id AS user_id, name, email, CONCAT(?, '/uploads/avatars/', avatar) AS avatar, created_at, token FROM users WHERE id = ?";
  let [row] = await pool.query(sql, [process.env.BASE_URL, id]);
  return row;
};

exports.register = async (body) => {
  let sql =
    "INSERT INTO users (name, email, password, verification_token, verification_expires) values (?, ?, ?, ?, ?)";
  let data = [
    body.name,
    body.email,
    body.password,
    body.verificationToken,
    body.verificationExpired,
  ];
  let [result] = await pool.query(sql, data);
  return result.insertId;
};

exports.addToken = async (token, id) => {
  let sql = "UPDATE users SET token = ? WHERE id = ?";
  await pool.query(sql, [token, id]);
};

exports.removeToken = async (id) => {
  let sql = "UPDATE users SET token = null WHERE id = ?";
  await pool.query(sql, [id]);
};

exports.findByToken = async (token) => {
  let sql = "SELECT token FROM users WHERE token = ?";
  let [row] = await pool.query(sql, [token]);
  return row;
};

exports.findByVerificationToken = async (token) => {
  let sql =
    "SELECT id, name, email, token, is_verified, verification_token, verification_expires FROM users WHERE verification_token = ?";
  let [row] = await pool.query(sql, [token]);
  return row;
};

exports.verifyEmail = async (id) => {
  let sql = "UPDATE users SET is_verified = 1 WHERE id = ?";
  await pool.query(sql, [id]);
};

exports.resendVerificationEmail = async (body) => {
  let sql =
    "UPDATE users SET verification_token = ?, verification_expires = ? where id = ?";
  let data = [body.verificationToken, body.verificationExpired, body.id];
  await pool.query(sql, data);
};

exports.getMe = async (id) => {
  let sql =
    "SELECT id AS user_id, name, email, CONCAT(?, '/uploads/avatars/', avatar) AS avatar, created_at FROM users WHERE id = ?";

  let [row] = await pool.query(sql, [process.env.BASE_URL, id]);
  return row;
};
