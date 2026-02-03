const express = require("express");
const authController = require("../controller/auth.controller");
const { verifyAuth } = require("../middleware/auth_middleware");
const { upload } = require("../middleware/multer");

const router = express.Router();


router.post("/auth/sign_up", authController.signUp);
router.post("/auth/sign_in", authController.signIn);
router.post("/auth/logout", authController.logout);


router.post(
  "/auth/password-recovery",
  authController.sendRecoverCode
);
router.post(
  "/auth/password-recovery/verification",
  authController.verifyRecoverCode
);
router.patch(
  "/auth/password-recovery",
  authController.resetPassword
);

router.put(
  "/auth/avatar",
  verifyAuth,
  upload.single("file"),
  authController.uploadAvatar
);

router.put(
  "/auth/name",
  verifyAuth,
  authController.updateName
);

router.put(
  "/auth/password",
  verifyAuth,
  authController.updatePassword
);

router.delete(
  "/auth/account",
  verifyAuth,
  authController.deleteAccount
);

router.post("/add", auth, controller.addMember);
router.post("/remove", auth, controller.removeMember);
router.get("/my", auth, controller.getMyConversations);
router.get(
  "/:conversationId/members",
  auth,
  controller.getConversationMembers
);

module.exports = router;
