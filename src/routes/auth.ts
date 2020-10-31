import express from "express";

const passportSetup = require("@/config/database/passport-setup");
const routerAuth = express.Router();
const { protect } = require("@/shared/middleware/auth");

const {
  register,
  login,
  google,
  googleCallback,
  googleLogin,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  uploadChannelAvatar,
  updatePassword,
} = require("@/controllers/auth");

//Google OAuth2.0

routerAuth.post("/register", register);
routerAuth.post("/login", login);
routerAuth.get("/google", google);
routerAuth.get("/google/redirect", googleCallback, googleLogin);
// routerAuth.get("/google_login", googleLogin)
routerAuth.post("/logout", logout);
routerAuth.get("/me", protect, getMe);
routerAuth.put("/update_details", protect, updateDetails);
routerAuth.put("/avatar", protect, uploadChannelAvatar);
routerAuth.put("/update_password", protect, updatePassword);
routerAuth.post("/forgot_password", forgotPassword);
routerAuth.put("/reset_password/:reset_token", resetPassword);

module.exports = routerAuth;
