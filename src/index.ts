const express = require("express");
const morgan = require("morgan");
const db = require("./config/db");
const route = require("./routes");

const app = express();
app.use(morgan("combined"));
db.connect();
route(app);

app.listen(8000, () => {
  console.log("Server running");
});
