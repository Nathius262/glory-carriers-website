import {renderAdminDashboard, renderAdminLoginForm, loginAdmin} from '../controllers/adminController.js';
import { Router } from 'express';

const router = Router();

router.route('/')
    .get(renderAdminDashboard);

router.route('/login')
    .get(renderAdminLoginForm)
    .post(loginAdmin);

export default router;