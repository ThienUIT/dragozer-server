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
export const JWT_COOKIE_EXPIRE: number = parseInt(
  process.env.JWT_COOKIE_EXPIRE!
);
