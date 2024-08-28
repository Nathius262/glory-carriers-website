import {renderAdminDashboard} from '../controllers/adminController.js';
import {renderAdminLoginForm, loginAdmin} from '../controllers/admin/login.js';
import { Router } from 'express';

const router = Router();

router.route('/')
    .get(renderAdminDashboard);

router.route('/login')
    .get(renderAdminLoginForm)
    .post(loginAdmin);

export default router;