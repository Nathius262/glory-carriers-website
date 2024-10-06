import { Router } from "express";
import { registerUser, renderRegisterForm, loginUser, renderLoginForm, logoutUser, checkAuthStatus } from '../controllers/authController.js';

const router = Router()

router.route('/register')
    .get(renderRegisterForm)
    .post(registerUser);

router.route('/login')
    .get(renderLoginForm)
    .post(loginUser);

router.post('/logout', logoutUser);

router.get('/status', checkAuthStatus);

export default router