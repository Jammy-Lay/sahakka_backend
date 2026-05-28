exports.jwtConfig = {
  secret: process.env.JWT_SECRET,
  expireIn: process.env.JWT_EXPIRE,
};
