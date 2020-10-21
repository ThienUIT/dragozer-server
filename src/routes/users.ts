const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("@/controllers/users");

const User = require("@/models/User");
import express from "express";
const routerUser = express.Router({ mergeParams: true });

const advancedResultsUser = require("@/shared/middleware/advancedResults");
const { protect, authorize } = require("@/shared/middleware/auth");

routerUser
  .route("/")
  .get(protect, authorize("admin"), advancedResultsUser(User), getUsers)
  .post(protect, authorize("admin"), createUser);

routerUser
  .route("/:id")
  .get(getUser)
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

module.exports = routerUser;
