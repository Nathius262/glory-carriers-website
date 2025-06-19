
import { Router } from "express";
import { dashboard_view } from "../controllers/admin.controller.js";
import { 
    renderIndex
} from "../controllers/root.controller.js";

const router = Router();

// Home Route
router.get('/', renderIndex);
router.get('/admin', dashboard_view)



export default router;