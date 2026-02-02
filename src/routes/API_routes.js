const express = require("express");
const {
  signUpController,
  signInController,
  logoutController,
  getCurrentUserController,
  uploadAvatarController,
  updateNameController,
  updatePasswordController,
  deleteAccountController,
  sendRecoverCodeController,
  verifyRecoverCodeController,
  resetPasswordController,
} = require("../controller/auth_controller");
const { verifyAuth } = require("../middleware/auth_middleware");
const { upload } = require("../middleware/multer");

const apiRoutes = express.Router();

// Auth Routes (Public)
apiRoutes.post("/auth/sign_up", signUpController);
apiRoutes.post("/auth/sign_in", signInController);
apiRoutes.post("/auth/logout", logoutController);

// Password Recovery Routes (Public)
apiRoutes.post("/auth/password-recovery", sendRecoverCodeController);
apiRoutes.post(
  "/auth/password-recovery/verification",
  verifyRecoverCodeController,
);
apiRoutes.patch("/auth/password-recovery", resetPasswordController);

// Protected Auth Routes
apiRoutes.get("/auth/me", verifyAuth, getCurrentUserController);
apiRoutes.put(
  "/auth/avatar",
  verifyAuth,
  upload.single("file"),
  uploadAvatarController,
);
apiRoutes.put("/auth/name", verifyAuth, updateNameController);
apiRoutes.put("/auth/password", verifyAuth, updatePasswordController);
apiRoutes.delete("/auth/account", verifyAuth, deleteAccountController);

module.exports = {
  apiRoutes,
};
