import { PaginationResponse } from "@/config/response/pagination.response";
import { UserRequest } from "@/config/request/user.requestt";
import { ResultsResponse } from "@/config/response/advance_results.response";

const { success, errors } = require("@/shared/utils/responseApi");
module.exports = async (
  req: UserRequest,
  res: ResultsResponse,
  model: any,
  populates: object[],
  status: string = "",
  or: object
) => {
  req.query.status = status;

  const reqQuery = { ...req.query };

  const removeFields: string[] = ["select", "sort", "page", "limit"];

  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  let query = model.find(JSON.parse(queryStr));

  if (or) {
    query = query.or(or);
  }

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
  const limit = parseInt(<string>req.query.limit, 10) || 10;
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
    res.json({
      success: true,
      count: results.length,
      totalPage,
      pagination,
      results: results,
    });
    // res.json(success("OK", {
    //     count: results.length,
    //     totalPage,
    //     pagination,
    //     results: results
    // }, res.statusCode))
  } else {
    res.json({
      success: true,
      results: results,
    });
  }
};
