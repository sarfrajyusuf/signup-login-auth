const userController = require("../controller/userController");
// const auth = require("../middleware/auth_verifyToken");
// const authValidation = require("../validation/authValidation");
const express = require("express");
const user_router = express();

user_router.post("/register", userController.register);
user_router.post("/login", userController.login);
user_router.get("/getUserData", userController.getUserData);
user_router.post("/forgotPassword", userController.forgotPassword);
user_router.post("/verifyEmail", userController.verifyEmail);
user_router.post("/resetPassword", userController.resetPassword);

module.exports = user_router;
