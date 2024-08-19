import bcrypt from 'bcryptjs';
import { check, validationResult, body } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const secrete_key = process.env.JWT_SECRET

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

      res.status(201).json({ token });
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).send('Server error');
    }
  },
];

export const renderRegisterForm = async (req, res) => {
  try {
    return res.render('./auth/register')
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

      res.status(200).json({ token });
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).send('Server error');
    }
  },
];

export const renderLoginForm = async (req, res) => {
  try {
    return res.render('./auth/login')
  } catch (error) {
    res.status(500).render('./errors/500', { message: 'Internal Server Error', error: error });
    
  }
};