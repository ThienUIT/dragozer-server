"use strict";
exports.__esModule = true;
exports.GOOGLE_API_HOST = exports.GOOGLE_SECRET = exports.GOOGLE_CLIENT_ID = exports.TEXT_SECRET = exports.COOKIE_EXPIRE = exports.APP_CONNECT_MLAB = exports.APP_CONNECT_DATABASE = exports.APP_PORT = exports.MAX_FILE_UPLOAD = void 0;
var path;
switch (process.env.NODE_ENV) {
  case "test":
    path = __dirname + "/../../.env.test";
    break;
  case "production":
    path = __dirname + "/../../.env.production";
    break;
  default:
    path = __dirname + "/../../.env.development";
}
require("dotenv").config();
exports.MAX_FILE_UPLOAD = parseInt(process.env.MAX_FILE_UPLOAD);
exports.APP_PORT = process.env.APP_PORT;
exports.APP_CONNECT_DATABASE = process.env.APP_CONNECT_DATABASE;
exports.APP_CONNECT_MLAB = process.env.APP_CONNECT_MLAB;
exports.COOKIE_EXPIRE = parseInt(process.env.COOKIE_EXPIRE);
exports.TEXT_SECRET = process.env.TEXT_SECRET;
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
exports.GOOGLE_SECRET = process.env.GOOGLE_SECRET;
exports.GOOGLE_API_HOST = process.env.GOOGLE_API_HOST;
