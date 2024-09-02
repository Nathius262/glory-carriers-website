import bcrypt from 'bcryptjs';
import pool from '../../config/databaseConfig.js';
import { check, validationResult, body } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config()

//render create page
export const renderCreateUser = async (req, res) => {
  res.render('./admin/user/create')
};

//render create page
export const renderUpdatePage = async (req, res) => {
  const userId = req.params.slug;

  try {
    // Check if the user exists
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.render('./admin/user/update', {user: user.rows[0]})

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }

};


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
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

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

// Helper function to determine user roles
const getUserRoles = (isAdmin, isStaff) => {
  const roles = [1,];
  if (isAdmin) roles.push(3); // Assuming '1' corresponds to 'admin' in your roles table
  if (isStaff) roles.push(2); // Assuming '2' corresponds to 'staff' in your roles table
  return roles;
};


//list all users
export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit of 10 users per page

  const offset = (page - 1) * limit; // Calculate the offset for the SQL query

  try {
    // Query to select the total number of users
    const totalUsersResult = await pool.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count, 10);

    // Query to select users with pagination
    const result = await pool.query(
      'SELECT id, email, username, user_roles FROM users ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    // Return the users with pagination info
    res.status(200).render('./admin/user/list', {
      success: true,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages,
      totalUsers,
      users: result.rows,  // This will contain an array of user objects with their ids, emails, usernames, and roles
    });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


//update each user
export const updateUser = [
  // Validate input
  [
    check('email', 'Please include a valid email').optional().isEmail(),
    check('username', 'Username is required').optional().not().isEmpty(),
    check('is_admin', 'is_admin should be a boolean').optional().isBoolean(),
    check('is_staff', 'is_staff should be a boolean').optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    

    const { email, username, is_admin = false, is_staff = false } = req.body;
    const userId = req.params.slug;

    try {
      // Check if the user exists
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

      if (user.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prepare the fields to update
      const fieldsToUpdate = {};
      if (email) fieldsToUpdate.email = email;
      if (username) fieldsToUpdate.username = username;

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

      // Update the user in the database
      const updatedUser = await pool.query(
        `UPDATE users 
         SET email = COALESCE($1, email), 
             username = COALESCE($2, username), 
             user_roles = $3 
         WHERE id = $4 
         RETURNING *`,
        [email, username, userRoles, userId]
      );

      res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser.rows[0],
      });

    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json(err);
    }
  },
];

//delete user
export const deleteUser = async (req, res) => {
  const userId = req.params.slug;

  try {
    // Check if the user exists
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.status(200).json({ message: 'User deleted successfully', redirectTo:"/admin/user" });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Server error', err });
  }
};
