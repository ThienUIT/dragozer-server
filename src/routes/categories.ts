const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("@/controllers/categories");

import express from "express";
const Category = require("@/models/Category");

const routerCategories = express.Router();

const advancedResultsCategories = require("@/shared/middleware/advancedResults");
const { protect, authorize } = require("@/shared/middleware/auth");

routerCategories.use(protect);

routerCategories
  .route("/")
  .get(advancedResultsCategories(Category), getCategories)
  .post(authorize("admin"), createCategory);

routerCategories
  .route("/:id")
  .get(authorize("admin"), getCategory)
  .put(authorize("admin"), updateCategory)
  .delete(authorize("admin"), deleteCategory);

module.exports = routerCategories;
