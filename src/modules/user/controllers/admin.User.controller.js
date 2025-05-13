import db from '../../../models/index.cjs';
import * as service from '../services/admin.User.service.js';

import { check, validationResult, body } from 'express-validator';


export const createUser = [
  // Validate input
  [
    check('email', 'Please include a valid email').isEmail(),
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
    check('is_admin', 'is_admin should be a boolean').optional().isBoolean(),
    check('is_staff', 'is_staff should be a boolean').optional().isBoolean(),


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

    const { email, username, password, is_admin = false, is_staff = false } = req.body;

    try {
      const user = db.User.findOne(email);

      if (user.rows.length) {
        return res.status(400).json({ message: `User with "${email}" already exists` });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Determine roles
      const userRoles = [];

      if (is_admin) {
        const adminRoleId = await pool.query('SELECT id FROM roles WHERE role_name = $1', ['admin']);
        userRoles.push(adminRoleId.rows[0].id);
      }

      if (is_staff) {
        const staffRoleId = await pool.query('SELECT id FROM roles WHERE role_name = $1', ['staff']);
        userRoles.push(staffRoleId.rows[0].id);
      }

      // Always assign 'user' role by default if no other roles are selected
      const userRoleId = await pool.query('SELECT id FROM roles WHERE role_name = $1', ['user']);
      userRoles.push(userRoleId.rows[0].id);

      // Create the user and add roles based on the checkbox inputs
      const newUser = await pool.query(
        'INSERT INTO users (email, username, password, user_roles) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, username, hashedPassword, userRoles]
      );

      res.status(201).json({
        message: 'User created successfully',
        redirectTo: "/admin/user",
      });

    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json(err);
    }
  },
];

export const findAll = async (req, res) => {
  try {
    const data = await service.findAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const destroy = async (req, res) => {
  try {
    const data = await service.destroy(req.params.id);
    res.status(200).json({ message: 'Deleted successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const renderCreateUser = async (req, res) => {
  res.render('./admins/create', {pageTitle:"GCMI Admin"})
};