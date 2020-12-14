let path;
require("dotenv").config();
switch (process.env.NODE_ENV) {
  case "test":
    path = `${__dirname}/../../.env.test`;
    console.log("test::", path);

    break;
  case "production":
    path = `${__dirname}/../../.env.production`;
    console.log("production::", path);
    break;
  default:
    path = `${__dirname}/../../.env.development`;
    console.log("dev::", path);
}

export const MAX_FILE_UPLOAD: number = parseInt(process.env.MAX_FILE_UPLOAD!);
export const APP_PORT = process.env.APP_PORT;
export const APP_CONNECT_DATABASE = process.env.APP_CONNECT_DATABASE;
export const APP_CONNECT_MLAB = process.env.APP_CONNECT_MLAB;
export const COOKIE_EXPIRE: number = parseInt(process.env.COOKIE_EXPIRE!);
export const TEXT_SECRET = process.env.TEXT_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
