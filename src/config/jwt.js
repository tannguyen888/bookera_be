const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiry: process.env.JWT_EXPIRY,
};

/**
 * Sign JWT token
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT token
 */
const jwtSign = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiry,
  });
};

/**
 * Decode JWT token
 * @param {String} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
const jwtDecode = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = {
  jwtConfig,
  jwtSign,
  jwtDecode,
};
