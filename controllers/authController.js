import bcrypt from 'bcryptjs';
import pool from '../config/databaseConfig.js';
import { check, validationResult, body } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const secrete_key = process.env.JWT_SECRET || "86d8110f7c96113cd57678c01747a41ace18d2ed190432b71f36132b62b1f0058bee12fd69c5f05211cadbd6a92319a8e19c2a473ff04a186c6349462ce5f7cb"

export const registerUser = [
  // Validate input
  [
    check('email', 'Please include a valid email').isEmail(),
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),

     // Custom validation to check if confirmPassword matches password
     body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;

    try {
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (user.rows.length) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await pool.query(
        'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *',
        [email, username, hashedPassword]
      );

      const payload = { userId: newUser.rows[0].id, role: newUser.rows[0].role };

      const token = jwt.sign(payload, secrete_key, { expiresIn: '1h' });

      // Set token as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS only in production
        sameSite: 'Strict', // Helps prevent CSRF attacks
        maxAge: 3600000, // 1 hour
      });

      res.status(201).json({
        message: 'User registered in successfully',
        authorized: true,
        //token: token,   Include the token in the response
      });

    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json(err);
    }
  },
];

export const renderRegisterForm = async (req, res) => {
  try {
    return res.render('./auth/register', {login:true})
  } catch (error) {
    res.status(500).render('./errors/500', { message: 'Internal Server Error', error: error });
    
  }
};

export const loginUser = [
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

      const payload = { userId: user.rows[0].id, role: user.rows[0].role };

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
        //token: token,   Include the token in the response
      });
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json(err);
    }
  },
];

export const renderLoginForm = async (req, res) => {
  try {
    return res.render('./auth/login', {login:true})
  } catch (error) {
    res.status(500).render('./errors/500', { message: 'Internal Server Error', error: error });
    
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

export const checkAuthStatus = (req, res) => {
  try {
    const token = req.cookies.token || null; // Get the JWT token from the HTTP-only cookie


    if (!token) {
      return res.status(200).json({ authenticated: false });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ authenticated: true, user: decoded });
    } catch (err) {
      return res.status(200).json({ authenticated: false });
    }
  } catch (error) {
    console.log(req.cookies)
    return res.status(200).json({ authenticated: false });
  }
};