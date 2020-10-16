import { APP_PORT } from "./utils/config_env";

const express = require("express");
const morgan = require("morgan");
const db = require("./config/database");
const route = require("./routes");

const app = express();
app.use(morgan("combined"));
db.connect();
route(app);

app.listen(APP_PORT, () => {
  console.log("Servers running", APP_PORT);
});
