import express from "express";

const routerAuth = express.Router();
const { protect } = require("../shared/middleware/auth");

const {
  register,
  login,
  google,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  uploadChannelAvatar,
  updatePassword,
} = require("../controllers/auth");

routerAuth.post("/register", register);
routerAuth.post("/login", login);
routerAuth.post("/google", google);
routerAuth.post("/logout", logout);
routerAuth.get("/me", protect, getMe);
routerAuth.put("/update_details", protect, updateDetails);
routerAuth.put("/avatar", protect, uploadChannelAvatar);
routerAuth.put("/update_password", protect, updatePassword);
routerAuth.post("/forgot_password", forgotPassword);
routerAuth.put("/reset_password/:reset_token", resetPassword);

module.exports = routerAuth;
