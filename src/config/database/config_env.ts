import * as dotenv from "dotenv";

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `${__dirname}/../../.env.test`;
    break;
  case "production":
    path = `${__dirname}/../../.env.production`;
    break;
  default:
    path = `${__dirname}/../../.env.development`;
}
dotenv.config({ path: path });

export const MAX_FILE_UPLOAD: number = parseInt(process.env.MAX_FILE_UPLOAD!);
export const APP_PORT = process.env.APP_PORT;
export const APP_CONNECT_DATABASE = process.env.APP_CONNECT_DATABASE;
export const APP_CONNECT_MLAB = process.env.APP_CONNECT_MLAB;
export const COOKIE_EXPIRE: number = parseInt(process.env.COOKIE_EXPIRE!);
export const TEXT_SECRET = process.env.TEXT_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
export const GOOGLE_API_HOST = process.env.GOOGLE_API_HOST;
