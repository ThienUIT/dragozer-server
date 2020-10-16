import { Router } from "express";
import { RouterConst } from "../shared/const/router.const";

const router = Router();
const onePageController = require("../controllers/OnePageController");

router.use(RouterConst.SEARCH, onePageController.search);
router.use(RouterConst.HISTORY, onePageController.history);
router.use(RouterConst.ROUTER_BASE, onePageController.home);

module.exports = router;
