import { Router } from "express";
import { registerUser, renderRegisterForm, loginUser, renderLoginForm, logoutUser, checkAuthStatus, registerOnlineUser, onlineRegisterForm } from '../controllers/authController.js';

const router = Router()

router.route('/register')
    .get(renderRegisterForm)
    .post(registerUser);

router.route('/login')
    .get(renderLoginForm)
    .post(loginUser);

router.post('/logout', logoutUser);

router.get('/status', checkAuthStatus);

router.route('/online-user-registration')
    .get(onlineRegisterForm)
    .post(registerOnlineUser);

export default router