import { NextFunction, Request, Response } from "express";
import { UserRequest } from "@/config/request/user.requestt";

const { success, errors } = require("@/shared/utils/responseApi");

const asyncHandler = require("@/shared/middleware/async");
const ErrorResponse = require("@/shared/utils/errorResponse");
const Category = require("@/models/Category");

// @desc    Get categories
// @route   GET /api/v1/categories
// @access  Private/Admin
exports.getCategories = asyncHandler(
  async (req: Request, res: any, next: NextFunction) => {
    res
      .status(200)
      .json(success("OK", { data: res.advancedResults }, res.statusCode));
  }
);

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Private/Admin
exports.getCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json(
          errors(`No category with that id of ${req.params.id}`, res.statusCode)
        );
    }

    res.status(200).json(success("OK", { data: category }, res.statusCode));
  }
);

// @desc    Create Category
// @route   POST /api/v1/categories/
// @access  Private/Admin
exports.createCategory = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const category = await Category.create({
      ...req.body,
      userId: req.user.id,
    });

    return res
      .status(200)
      .json(success("OK", { data: category }, res.statusCode));
  }
);

// @desc    Update category
// @route   PUT /api/v1/categories
// @access  Private/Admin
exports.updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!category) {
      return res
        .status(404)
        .json(
          errors(`No category with that id of ${req.params.id}`, res.statusCode)
        );
    }

    return res
      .status(200)
      .json(success("Update success", { data: category }, res.statusCode));
  }
);

// @desc    Delete Category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json(
          errors(`No category with that id of ${req.params.id}`, res.statusCode)
        );
    }

    await category.remove();

    return res.status(200).json(success("Delete success", {}, res.statusCode));
  }
);
