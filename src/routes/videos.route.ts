import { Router } from "express";
import { RouterConst } from "@/shared/const/router.const";

const videoController = require("@/controllers/VideoController");
const router = Router();

router.use("/:slug", videoController.show);
router.use(RouterConst.ROUTER_BASE, videoController.index);

module.exports = router;
