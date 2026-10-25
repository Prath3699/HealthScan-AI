const express = require("express");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { login } = require("../controllers/loginController");

const loginRoutes = express.Router();

// Brute-force protection on credentials endpoint.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts, try later." },
});

loginRoutes.post(
  "/",
  loginLimiter,
  validate([
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role")
      .isIn(["Doctor", "Patient"])
      .withMessage('role must be "Doctor" or "Patient"'),
  ]),
  asyncHandler(login)
);

module.exports = loginRoutes;
