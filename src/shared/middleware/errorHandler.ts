import { NextFunction, Response, Request } from "express";
import colors from "colors";

const { ErrorResponse } = require("../utils/errorResponse");
const { errors } = require("../utils/responseApi");
const errorHandler = (
  err: typeof ErrorResponse,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  let error = {
    ...err,
  };

  error.message = err.message;

  console.log(colors.red(err.stack!.red));

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    // const message = `Resource not found with id of ${err.value}`;
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }
  // console.log(err.name);

  // Mongoose duplicate key
  if (err.statusCode === 11000) {
    const message = "Duplicate field value entered";
    console.log(err);
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message: Array<any> = [];
    Object.values(err.statusCode).forEach((errr: any) => {
      message.push({
        field: errr.properties.path,
        message: errr.message,
      });
    });
    error = new ErrorResponse(message[0], 400, undefined);
  }

  res
    .status(error.statusCode || 500)
    .json(
      errors(
        error.messageWithField || error.message || "Server Error",
        error.statusCode
      )
    );
  res
    .status(error.statusCode || 500)
    .json(
      errors(
        error.messageWithField || error.message || " Server Error",
        error.statusCode
      )
    );
};

module.exports = errorHandler;
