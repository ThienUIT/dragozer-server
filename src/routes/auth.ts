import express from "express";
const routerAuth = express.Router();
const { protect } = require("@/shared/middleware/auth");
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  uploadChannelAvatar,
  updatePassword,
} = require("@/controllers/auth");

routerAuth.post("/register", register);
routerAuth.post("/login", login);
routerAuth.post("/logout", logout);
routerAuth.post("/me", protect, getMe);
routerAuth.put("/updatedetails", protect, updateDetails);
routerAuth.put("/avatar", protect, uploadChannelAvatar);
routerAuth.put("/updatepassword", protect, updatePassword);
routerAuth.post("/forgotpassword", forgotPassword);
routerAuth.put("/resetpassword/:resettoken", resetPassword);

module.exports = routerAuth;
