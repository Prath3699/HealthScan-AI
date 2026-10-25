const express = require("express");
const { login } = require("../controllers/loginController");
const loginRoutes = express.Router();

loginRoutes.post("/", login);

module.exports = loginRoutes;
