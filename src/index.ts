import express from "express";
import morgan from "morgan";

const app = express();
app.use(morgan("combined"));
app.get("/", (req, res) => res.send("Hello woasdasdrld"));
app.listen(8000, () => {
  console.log("Server running");
});
