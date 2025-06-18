import express from 'express';
import * as controller from '../controllers/Auth.controller.js';
import * as adminController from '../controllers/admin.Auth.controller.js';
import moduleView from '../../../middlewares/moduleViews.js';

const router = express.Router();


router.use(moduleView('auth'));

// admin login view routes
router.route('/admin/login')
    .get(adminController.admin_login_view)
    .post(adminController.authenticateAdmin);


export default router;
