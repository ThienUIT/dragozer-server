import { APP_PORT } from "./config/database/config_env";

const colors = require("colors");
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./shared/middleware/errorHandler");
const route = require("./routes");
const db = require("./config/database");
const app = express();

db.connect();
// Instead of use body-parser, I use express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));

// File uploading
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:8080",
      "https://dragozero.netlify.app",
    ],
    optionsSuccessStatus: 200,
  })
);

// Rate limiting
// app.use(
//   rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 mins
//     max: 100, // 100 request per 10 mins
//   })
// );

// Prevent http param pollution
app.use(hpp());

// error Handler
app.use(errorHandler);

//Route init
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
