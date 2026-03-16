import express from 'express';
import * as controller from '../controllers/Auth.controller.js';
import moduleView from '../../../middlewares/moduleViews.js';
import {requireAuthOrRedirectCookie, authenticate} from '../../../middlewares/auth.middleware.js';

const router = express.Router();


router.use(moduleView('auth'));

// admin login view routes
router.get('/login', controller.loginView);
router.get('/register', controller.registerView);
router.get('/logout', controller.logoutUser);


//Render Views
router.get("/forgot-password", controller.forgotPasswordView);
router.get("/reset-password", controller.resetPasswordView);
router.get("/change-password", requireAuthOrRedirectCookie, authenticate, controller.changePasswordView);

// Handle Forgot Password
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-otp", controller.verifyOTP);
router.post("/change-password", requireAuthOrRedirectCookie, authenticate, controller.changePassword);


// ---------- Admin ----------
router.post('/admin/register', (req, res) => {
  req.body.role = 'admin';
  return registerUser(req, res);
});
router.post('/admin/login', (req, res) => {
  req.body.role = 'admin';
  return controller.loginUser(req, res);
});

// ---------- User ----------
router.post('/user/register', (req, res) => {
  req.body.role = 'user';
  return controller.registerUser(req, res);
});
router.post('/user/login', (req, res) => {
  req.body.role = 'user';
  return controller.loginUser(req, res);
});

// ---------- Staff (future-ready) ----------
// router.post('/staff/register', (req, res) => {
//   req.body.role = 'staff';
//   return registerUser(req, res);
// });
// router.post('/staff/login', (req, res) => {
//   req.body.role = 'staff';
//   return loginUser(req, res);
// });

export default router;