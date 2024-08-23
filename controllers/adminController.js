import { verifyToken, isAdmin } from '../middlewares/auth.js';
import {loginUser,} from './authController.js'
import bcrypt from 'bcryptjs';
import pool from '../config/databaseConfig.js';
import { check, validationResult, body } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const secrete_key = process.env.JWT_SECRET


export const renderAdminDashboard = [
    verifyToken,
    isAdmin,
    async (req, res) => {
        try {
            res.render('./admin/admin');
        } catch (error) {
            res.status(404).send('page not found');
        }
    }
];


export const loginAdmin = [
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (!user.rows.length) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.rows[0].password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }


      const payload = { userId: user.rows[0].id, roles: user.rows[0].user_roles };
      if (!payload.roles.includes(3) || !payload.roles.includes(2)) {
        return res.status(403).json({ message: 'Access denied; You must be logged in as an admin or staff' });
      }

      const token = jwt.sign(payload, secrete_key, { expiresIn: '1h' });

      // Set token as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS only in production
        sameSite: 'Strict', // Helps prevent CSRF attacks
        maxAge: 3600000, // 1 hour
      });
    
      // Send response with authorization status
      res.status(201).json({
        message: 'User Logged in successfully',
        authorized: true,
        isAdmin:true
        //token: token,   Include the token in the response
      });
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json(err);
    }
  }  
];

export const renderAdminLoginForm = async (req, res) => {
  try {
    return res.render('./admin/login', {login:true})
  } catch (error) {
    res.status(500).render('./errors/500', { message: 'Internal Server Error', error: error });
    
  }
};