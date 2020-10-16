import { Router } from "express";

const router = Router();
const onePageController = require("../controllers/OnePageController");

router.use("/search", onePageController.search);
router.use("/history", onePageController.history);
router.use("/", onePageController.home);

module.exports = router;
