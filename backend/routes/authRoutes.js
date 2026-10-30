const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { refresh, logout } = require("../controllers/loginController");

const authRoutes = express.Router();

// Silent re-authentication: valid httpOnly refresh cookie -> new access token.
authRoutes.post("/refresh", asyncHandler(refresh));
// Explicit sign-out: revoke the refresh-token family and clear the cookie.
authRoutes.post("/logout", asyncHandler(logout));

module.exports = authRoutes;
