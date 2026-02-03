const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  signUpService,
  signInService,
  signUpWithGoogleService,
  signInWithGoogleService,
  uploadAvatarService,
  updateNameService,
  updatePasswordService,
  deleteAccountService,
  sendRecoverCodeService,
  verifyRecoverCodeService,
  resetPasswordService,
} = require("../services/auth_service");

/* ======================
   HELPER
====================== */
const generateToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      role_id: user.role_id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "2h" }
  );

const userResponse = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  avatar_url: user.avatar_url,
  role_id: user.role_id,
});

/* ======================
   SIGN UP
====================== */
exports.signUp = async (req, res) => {
  try {
    const data = req.body;

    // Google signup
    if (data.credential) {
      const user = await signUpWithGoogleService(data.credential);
      const token = generateToken(user);

      return res.status(201).json({
        user: userResponse(user),
        token,
      });
    }

    const { username, email, password } = data;

    if (!username || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const user = await signUpService({
      username,
      email,
      password,
    });

    const token = generateToken(user);

    res.status(201).json({
      user: userResponse(user),
      token,
    });
  } catch (err) {
    console.error("SIGN UP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   SIGN IN
====================== */
exports.signIn = async (req, res) => {
  try {
    const data = req.body;

    // Google login
    if (data.credential) {
      const user = await signInWithGoogleService(data.credential);
      const token = generateToken(user);

      return res.json({
        user: userResponse(user),
        token,
      });
    }

    const { email, password } = data;

    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    const user = await signInService(email, password);

    const token = generateToken(user);

    res.json({
      user: userResponse(user),
      token,
    });
  } catch (err) {
    console.error("SIGN IN ERROR:", err);
    res.status(401).json({ message: err.message });
  }
};

/* ======================
   LOGOUT
====================== */
exports.logout = async (req, res) => {
  // JWT → FE tự xoá token
  res.json({ message: "Logged out successfully" });
};

/* ======================
   PROFILE
====================== */
exports.uploadAvatar = async (req, res) => {
  await uploadAvatarService(req.user.userId, req.file.filename);
  res.json({ message: "Avatar updated" });
};

exports.updateName = async (req, res) => {
  await updateNameService(req.user.userId, req.body.username);
  res.json({ message: "Name updated" });
};

exports.updatePassword = async (req, res) => {
  await updatePasswordService(
    req.user.userId,
    req.body.oldPassword,
    req.body.newPassword
  );
  res.json({ message: "Password updated" });
};

/* ======================
   DELETE ACCOUNT
====================== */
exports.deleteAccount = async (req, res) => {
  await deleteAccountService(req.user.userId);
  res.json({ message: "Account deleted" });
};

/* ======================
   PASSWORD RECOVERY
====================== */
exports.sendRecoverCode = async (req, res) => {
  await sendRecoverCodeService(req.body.email);
  res.json({ message: "Recovery code sent" });
};

exports.verifyRecoverCode = async (req, res) => {
  await verifyRecoverCodeService(req.body.email, req.body.code);
  res.json({ message: "Code verified" });
};

exports.resetPassword = async (req, res) => {
  await resetPasswordService(
    req.body.email,
    req.body.code,
    req.body.newPassword
  );
  res.json({ message: "Password reset successful" });
};
