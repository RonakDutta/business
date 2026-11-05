const jwt = require("jsonwebtoken");

function jwtGenerator(user) {
  const payload = {
    id: user.id,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

module.exports = jwtGenerator;
