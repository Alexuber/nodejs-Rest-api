const express = require("express");

const authController = require("../../controllers/auth-controllers");
const router = express.Router();
const { validateBody } = require("../../utils/validateBody");
const { schemas } = require("../../models/user");
const { authenticate } = require("../../middlewares");

router.post(
  "/register",
  validateBody(schemas.userRegisterSchema),
  authController.register
);

router.post(
  "/login",
  validateBody(schemas.userLoginSchema),
  authController.login
);

router.get("/current", authenticate, authController.getCurrent);

router.post("/logout", authenticate, authController.logout);

module.exports = router;
