
import { Router } from "express";
import { dashboard_view } from "../controllers/admin.controller.js";
import * as controller from '../controllers/root.controller.js'
const router = Router();

// Home Route
router.get('/', controller.index_view);
router.get('/about', controller.about_view);
router.get('/sitemap', controller.sitemap_view);
router.get('/admin', dashboard_view)



export default router;