import "module-alias/register";
import { APP_PORT, TEXT_SECRET } from "@/config/database/config_env";

const passport = require("passport");
const colors = require("colors");
const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("@/shared/middleware/errorHandler");
const route = require("@/routes");
const db = require("@/config/database");
const app = express();

db.connect();
// Instead of use body-parser, I use express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// console response
app.use(morgan("dev"));

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
    origin: ["http://localhost", "http://localhost:8080"],
    optionsSuccessStatus: 200,
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100, // 100 request per 10 mins
  })
);

// Prevent http param pollution
app.use(hpp());
// cookieSession
// app.use(
//     cookieSession({
//         maxAge: 24 * 60 * 60 * 1000,
//         keys: [TEXT_SECRET, TEXT_SECRET],
//     })
// );
// Initialize the passport object on every request
app.use(passport.initialize());
// app.use(passport.session());

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
