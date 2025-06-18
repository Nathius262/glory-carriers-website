import { Router } from "express";
import { 
    index_view
} from "../controllers/root.controller.js";
import { dashboard_view } from "../controllers/admin.controller.js";

const router = Router();

// Home Route
router.get('/', index_view);
router.get('/admin', dashboard_view)


export default router;