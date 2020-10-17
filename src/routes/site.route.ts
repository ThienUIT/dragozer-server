import { Router } from "express";
import { RouterConst } from "../shared/const/router.const";

const router = Router();
const siteController = require("../controllers/siteController");

router.use(RouterConst.SEARCH, siteController.search);
router.use(RouterConst.HISTORY, siteController.history);
router.use(RouterConst.ROUTER_BASE, siteController.home);

module.exports = router;
