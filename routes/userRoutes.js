const { Router } = require("express");
const route = Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

// register ➢ post data to server
route.post("/api/auth/register", userController.register);
// activation ➢ 
route.post("/api/auth/activation", userController.activate);
route.post("/api/auth/signing", userController.signing);
route.post("/api/auth/access", userController.access);
route.post("/api/auth/forgot_pass", userController.forgot);
// actions like changing password, avatar ➢ user need to have server auth ➢ middleware check if access token is valid
route.post("/api/auth/reset_pass", auth, userController.reset);
route.get("/api/auth/user", auth, userController.info);
route.patch("/api/auth/user_update", auth, userController.update);
route.get("/api/auth/signout", userController.signout);
route.post("/api/auth/google_signing", userController.google);

module.exports = route;