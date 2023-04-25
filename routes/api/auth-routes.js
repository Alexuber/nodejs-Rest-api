const express = require("express");

const authController = require("../../controllers/auth-controllers");
const router = express.Router();
const { validateBody } = require("../../utils/validateBody");
const { schemas } = require("../../models/user");

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

module.exports = router;
