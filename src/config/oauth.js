const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
dotenv.config();

// Config Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = {
  client,
};
