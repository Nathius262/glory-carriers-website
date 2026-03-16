import { registerUserService, loginUserService } from '../services/Auth.service.js';
import * as mail from '../../../utils/email.js'
import db from '../../../models/index.cjs';
import bcrypt from 'bcryptjs';

// ---------- Register ----------
export const registerUser = async (req, res) => {
  try {
    const role = req.body.role;
    const {token, user} = await registerUserService(req.body, role);
    const redirectTo = req.cookies.redirect_after_auth || `/${role}`;
    res.clearCookie('redirect_after_auth');

     // Optional: set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 259200000, // 3 days
    });

    res.status(201).json({ message: `${role} registered successfully`, redirectTo: redirectTo });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ---------- Login ----------
export const loginUser = async (req, res) => {
  try {
    const role = req.body.role;
    const { token, user } = await loginUserService(req.body, role);

    // Optional: set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 259200000, // 3 days
    });

    const redirectTo = req.cookies.redirect_after_auth || `/${role}`;
    res.clearCookie('redirect_after_auth');

    res.status(200).json({ message: 'Login successful', user, token, redirectTo: redirectTo });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: err.message });
  }
};

// ---------- Logout ----------
export const logoutUser = async (req, res) => {
  try {
    // Clear the auth cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    // Optionally clear redirect cookie too
    res.clearCookie('redirect_after_auth');

    res.redirect('/auth/login');
  } catch (err) {
    res.status(500).json({ message: 'Error logging out', error: err.message });
  }
};

// ---------- forgot password ----------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      req.flash("error", "Email not found");
      return res.redirect("/auth/forgot-password"); // redirect back to form
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000);

    await db.PasswordReset.create({ user_id: user.id, otp, expires_at });

    await mail.sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      html: mail.passwordResetOtpTemplate(user.first_name || "User", otp),
    });

    req.flash("success", "OTP sent to your email");
    return res.redirect(`/auth/reset-password?email=${encodeURIComponent(user.email)}`);
  } catch (error) {
    console.log("forgot password error", error);
    req.flash("error", error.message);
    return res.redirect("/auth/forgot-password");
  }
};

// ---------- verify otp ----------
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      req.flash("error", "Invalid email");
      return res.redirect("/auth/reset-password");
    }

    const reset = await db.PasswordReset.findOne({
      where: { user_id: user.id, otp, used: false },
      order: [["createdAt", "DESC"]],
    });

    if (!reset || reset.expires_at < new Date()) {  // ⚡ match DB column name
      req.flash("error", "Invalid or expired OTP");
      return res.redirect(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });
    await reset.update({ used: true });

    await mail.sendEmail({
      to: user.email,
      subject: "Password Reset Successful",
      html: mail.passwordResetSuccessTemplate(user.first_name || "User"),
    });

    req.flash("success", "Password reset successfully. You can now login.");
    return res.redirect("/auth/login"); // ✅ better UX
  } catch (error) {
    console.log("password verification error", error);
    req.flash("error", error.message);
    return res.redirect("/auth/reset-password");
  }
};

// ---------- change password ----------
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await db.User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      req.flash("error", "Old password is incorrect");
      return res.redirect("/auth/change-password");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });

    await mail.sendEmail({
      to: user.email,
      subject: "Password Changed",
      html: mail.passwordChangedTemplate(user.first_name || "User"),
    });

    req.flash("success", "Password changed successfully");
    return res.redirect("/auth/change-password");
  } catch (error) {
    console.log("Password change error", error);
    req.flash("error", error.message);
    return res.redirect("/auth/change-password");
  }
};



// ---------- Render Views ----------
export const loginView = async (req, res) => {
  res.render('login', { pageTitle: 'Login' });
}

export const registerView = async (req, res) => {
  res.render('register', { pageTitle: 'Register' });
}

export const forgotPasswordView = (req, res) => {
  res.render("forgot-password", { pageTitle: "Forgot Password" });
};

export const resetPasswordView = (req, res) => {
  res.render('reset-password', {pageTitle: "Reset Password"});
};

export const changePasswordView = (req, res) => {
  res.render('change-password', {pageTitle: "Change Password"});
};