const express = require("express");

const authController = require("../../controllers/auth-controllers");
const router = express.Router();
const { validateBody } = require("../../utils/validateBody");
const { schemas } = require("../../models/user");
const { authenticate, upload } = require("../../middlewares");

router.post(
  "/register",
  validateBody(schemas.userRegisterSchema),
  authController.register
);

router.get("/verify/:verificationToken", authController.verify);

router.post(
  "/verify",
  validateBody(schemas.emailSchema),
  authController.resendVerifyEmail
);

router.post(
  "/login",
  validateBody(schemas.userLoginSchema),
  authController.login
);

router.get("/current", authenticate, authController.getCurrent);

router.post("/logout", authenticate, authController.logout);

router.patch(
  "/:contactId/subscription",
  authenticate,
  validateBody(schemas.subscriptionUpdateSchema),
  authController.subscriptionUpdate
);

router.patch(
  "/avatars",
  upload.single("avatarURL"),
  authenticate,
  authController.avatarUpdate
);

module.exports = router;
