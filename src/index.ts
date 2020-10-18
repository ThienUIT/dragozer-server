import { APP_PORT } from "./shared/utils/config_env";

const colors = require("colors");
const express = require("express");
const morgan = require("morgan");
const db = require("./config/database");
const errorHandler = require("./shared/middleware/error");
const route = require("./routes");

const app = express();
app.use(morgan("combined"));
app.use(errorHandler);
db.connect();
route(app);

const server = app.listen(8000, () => {
  console.log(colors.cyan.underline.bold(`Servers running ${APP_PORT}`));
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(colors.red.bold(`Error: ${err}`));
  // Close server & exit process
  server.close(() => process.exit(1));
});
