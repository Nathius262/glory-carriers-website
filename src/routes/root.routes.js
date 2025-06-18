
import { Router } from "express";
import { dashboard_view } from "../controllers/admin.controller.js";
import { 
    renderIndex, renderAbout, renderSitemap, 
    renderDepartment, joinDepartmentForm, joinDepartment,
    renderContact, renderEvent, registerEvent, renderGiving,
    registerHealingSchool, renderHealingSchool
} from "../controllers/root.controller.js";

const router = Router();

// Home Route
router.get('/', renderIndex);
router.get('/about', renderAbout);
router.get('/contact', renderContact);

router.get('/admin', dashboard_view)



export default router;