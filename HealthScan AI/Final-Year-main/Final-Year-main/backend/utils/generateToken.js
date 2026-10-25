const jwt = require("jsonwebtoken");

/**
 * Single source of truth for JWT signing.
 * The role is embedded so requireRole() can authorize without extra DB hits.
 */
const generateToken = (user, role) => {
  return jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

module.exports = generateToken;
