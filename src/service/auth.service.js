const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const authService = require("../service/auth.service");
const logger = require("../lib/logger");

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is up and running on ${PORT} ...`);
});

/* ======================================================
   SIGN IN  → FE: POST /auth/sign_in
====================================================== */
app.post("/auth/sign_in", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const user = await authService.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" }
    );

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar || null,
    };

    return res.json({
      user: safeUser,
      token,
    });
  } catch (error) {
    logger.error("SIGN IN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   SIGN UP  → FE: POST /auth/sign_up
====================================================== */
app.post("/auth/sign_up", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existed = await authService.findUserByEmail(email);
    if (existed) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await authService.createUser({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Sign up successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    logger.error("SIGN UP ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   LOGOUT  → FE: POST /auth/logout
====================================================== */
app.post("/auth/logout", async (req, res) => {
  // JWT → logout phía client (FE xoá token)
  return res.json({
    message: "Logout successfully",
  });
});

/* ======================================================
   PASSWORD RECOVERY – STEP 1
   FE: POST /auth/password-recovery
====================================================== */
app.post("/auth/password-recovery", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await authService.findUserByEmail(email);

    // Không leak user tồn tại hay không
    if (user) {
      // TODO: send email + code
    }

    return res.json({
      message: "If email exists, recovery code has been sent",
    });
  } catch (error) {
    logger.error("PASSWORD RECOVERY ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   PASSWORD RECOVERY – VERIFY CODE
   FE: POST /auth/password-recovery/verification
====================================================== */
app.post("/auth/password-recovery/verification", async (req, res) => {
  try {
    const { email, code } = req.body;

    // TODO: verify code from DB / cache
    return res.json({
      message: "Verification success",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid verification code",
    });
  }
});

/* ======================================================
   PASSWORD RECOVERY – RESET PASSWORD
   FE: PATCH /auth/password-recovery
====================================================== */
app.patch("/auth/password-recovery", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await authService.resetPasswordByEmail(email, hashedPassword);

    return res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    logger.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   VALIDATE TOKEN (OPTIONAL – FE CÓ THỂ DÙNG)
====================================================== */
app.get("/auth/validate-token", (req, res) => {
  try {
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const token = req.header(tokenHeaderKey);

    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return res.json({
      valid: true,
      user: decoded,
    });
  } catch {
    return res.status(401).json({
      valid: false,
      message: "Invalid token",
    });
  }
});

module.exports = app;
