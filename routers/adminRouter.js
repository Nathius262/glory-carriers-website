import {renderAdminDashboard} from '../controllers/adminController.js';
import {renderAdminLoginForm, loginAdmin} from '../controllers/admin/login.js';
import { Router } from 'express';

const router = Router();

//admin dashbord route
router.route('/')
    .get(renderAdminDashboard);

//login route
router.route('/login')
    .get(renderAdminLoginForm)
    .post(loginAdmin);

export default router;