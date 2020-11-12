// @eg      channelName=reagan&select=email&sort=-channelName,email

import { NextFunction } from "express";
import { PaginationResponse } from "@/config/response/pagination.response";
import { UserRequest } from "@/config/request/user.requestt";
import { ResultsResponse } from "@/config/response/advance_results.response";

const advancedResults = (
  model: any,
  populates: object[],
  visibility = { status: "", filter: "" }
) => async (req: UserRequest, res: ResultsResponse, next: NextFunction) => {
  if (visibility.status == "private") {
    req.query.userId = req["user"];
    console.log("advanced Results::", req.query.userId);
    if (visibility.filter == "channel") {
      req.query.channelId = req.user._id;
      delete req.query.userId;
    }
  } else if (visibility.status == "public") {
    req.query.status = "public";
  }

  const reqQuery = { ...req.query };
  console.log("advanced Results::", reqQuery);

  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param: string) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  let query = model.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = (<string>req.query.select).split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = (<string>req.query.sort).split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort({ createdAt: -1 });
    // '-createdAt'
  }

  // Pagination
  const page = parseInt(<string>req.query.page, 10) || 1;
  const limit = parseInt(<string>req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  const totalPage = Math.ceil(total / limit);

  if (parseInt(<string>req.query.limit) !== 0) {
    query = query.skip(startIndex).limit(limit);
  }

  if (populates) {
    populates.forEach((populate) => {
      query = query.populate(populate);
    });
  }

  const results = await query;

  // Pagination result
  const pagination: PaginationResponse = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  if (parseInt(<string>req.query.limit) !== 0) {
    res.advancedResults = {
      success: true,
      count: results.length,
      totalPage,
      pagination,
      data: results,
    };
  } else {
    res.advancedResults = {
      success: true,
      data: results,
    };
  }
  next();
};

module.exports = advancedResults;
