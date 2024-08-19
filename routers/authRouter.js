import { Router } from "express";
import { registerUser, renderRegisterForm, loginUser, renderLoginForm } from '../controllers/authController.js';

const router = Router()

router.route('/register')
    .get(renderRegisterForm)
    .post(registerUser);

router.route('/login')
    .get(renderLoginForm)
    .post(loginUser);


export default router