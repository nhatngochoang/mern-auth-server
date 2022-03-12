const { Router } = require("express");
const route = Router();
const userController = require("../controllers/userController");

// post data to server
route.post("/api/auth/register", userController.register);

module.exports = route;