const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authService = require("../services/auth.service");

const generateToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "2h" }
  );

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;

  const existing = await authService.findByEmail(email);
  if (existing)
    return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await authService.createUser({
    username,
    email,
    password: hashed,
  });

  res.status(201).json({ user });
};

exports.signIn = async (req, res) => {
  const { username, password } = req.body;

  const user = await authService.findByUsername(username);
  if (!user)
    return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Wrong password" });

  const token = generateToken(user);

  res.json({ user, token });
};

exports.logout = async (req, res) => {
  // JWT → logout phía client
  res.json({ message: "Logged out successfully" });
};

exports.uploadAvatar = async (req, res) => {
  await authService.updateAvatar(req.user.userId, req.file.filename);
  res.json({ message: "Avatar updated" });
};

exports.updateName = async (req, res) => {
  await authService.updateName(req.user.userId, req.body.username);
  res.json({ message: "Name updated" });
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await authService.findById(req.user.userId);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Wrong old password" });

  const hashed = await bcrypt.hash(newPassword, 10);
  await authService.updatePassword(user.id, hashed);

  res.json({ message: "Password updated" });
};

exports.deleteAccount = async (req, res) => {
  await authService.deleteUser(req.user.userId);
  res.json({ message: "Account deleted" });
};

exports.sendRecoverCode = async (req, res) => {
  await authService.sendRecoverCode(req.body.email);
  res.json({ message: "Recovery code sent" });
};

exports.verifyRecoverCode = async (req, res) => {
  await authService.verifyRecoverCode(req.body.email, req.body.code);
  res.json({ message: "Code verified" });
};

exports.resetPassword = async (req, res) => {
  await authService.resetPassword(
    req.body.email,
    req.body.code,
    req.body.newPassword
  );
  res.json({ message: "Password reset successful" });
};
