import { Router } from "express";
const router = Router();
const videoController = require("../controllers/VideoController");

router.use("/:slug", videoController.show);
router.use("/", videoController.index);

module.exports = router;
