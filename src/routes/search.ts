const { search } = require("@/controllers/search");
import express from "express";

const routerSearch = express.Router();

routerSearch.post("/", search);

module.exports = routerSearch;
