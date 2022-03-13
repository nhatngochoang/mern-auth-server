const { Router } = require("express");
const route = Router();
const userController = require("../controllers/userController");

// register ➢ post data to server
route.post("/api/auth/register", userController.register);
// activation ➢ 
route.post("/api/auth/activation", userController.activate);
route.post("/api/auth/signing", userController.signing);
route.post("/api/auth/access", userController.access);

module.exports = route;