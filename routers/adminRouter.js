import {renderAdminDashboard} from '../controllers/adminController.js';
import { Router } from 'express';

const router = Router();

router.route('/')
    .get(renderAdminDashboard);


export default router;