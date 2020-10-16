import express from "express";
import morgan from "morgan";

const app = express();

const db = require("./config/db");
db.connect();
app.use(morgan("combined"));
app.get("/", (req, res) => res.send("Hello maria ozawa"));
app.listen(8000, () => {
  console.log("Server running");
});
