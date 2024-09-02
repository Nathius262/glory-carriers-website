import pool from '../../config/databaseConfig.js';
import { check, validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config()

//render create page
export const renderCreateRole = async (req, res) => {
  res.render('./admin/role/create')
};

//render create page
export const renderUpdatePage = async (req, res) => {
  const roleId = req.params.id;

  try {
    // Check if the user exists
    const role = await pool.query('SELECT * FROM roles WHERE id = $1', [roleId]);

    if (role.rows.length === 0) {
      return res.status(404).json({ message: 'name not found' });
    }

    res.render('./admin/role/update', {role: role.rows[0]})

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }

};

export const createrole = [
  // Validate input
  [
    check('role_name', 'Name is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role_name } = req.body;

    try {
      const role = await pool.query('SELECT * FROM roles WHERE role_name = $1', [role_name]);

      if (role.rows.length) {
        return res.status(400).json({ message: `name with "${role_name}" already exists` });
      }


      // Create the role and add roles based on the checkbox inputs
      const newRole = await pool.query(
        'INSERT INTO roles (role_name) VALUES ($1) RETURNING *',
        [role_name]
      );

      res.status(201).json({
        message: 'Role created successfully',
        redirectTo: "/admin/role",
      });

    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json(err);
    }
  },
];

//list all role name
export const getAllRole = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit of 10 role name per page

  const offset = (page - 1) * limit; // Calculate the offset for the SQL query

  try {
    // Query to select the total number of role name
    const totalUsersResult = await pool.query('SELECT COUNT(*) FROM roles');
    const totalUsers = parseInt(totalUsersResult.rows[0].count, 10);

    // Query to select role name with pagination
    const result = await pool.query(
      'SELECT id, role_name FROM roles ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    // Return the role name with pagination info
    res.status(200).render('./admin/role/list', {
      success: true,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages,
      totalUsers,
      roles: result.rows,  // This will contain an array of user objects with their ids, emails, usernames, and roles
    });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

//update each user
export const updaterole = [
  // Validate input
  [
    check('role_name', 'Name is required').optional().not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    

    const { role_name } = req.body;
    const roleId = req.params.id;

    try {
      // Check if the user exists
      const role = await pool.query('SELECT * FROM roles name WHERE id = $1', [roleId]);

      if (role.rows.length === 0) {
        return res.status(404).json({ message: 'Not found' });
      }

      // Prepare the fields to update
      const fieldsToUpdate = {};
      if (role_name) fieldsToUpdate.role_name = role_name;

    
      // Update the user in the database
      const updatedUser = await pool.query(
        `UPDATE roles 
         SET role_name = COALESCE($1, role_name)
         WHERE id = $2 
         RETURNING *`,
        [role_name, roleId]
      );

      res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser.rows[0],
      });

    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({message:err});
    }
  },
];

//delete user
export const deleteRole = async (req, res) => {
  const roleId = req.params.id;

  try {
    // Check if the user exists
    const user = await pool.query('SELECT * FROM roles WHERE id = $1', [roleId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Name not found' });
    }

    // Delete the user
    await pool.query('DELETE FROM roles WHERE id = $1', [roleId]);

    res.status(200).json({ message: 'Name deleted successfully', redirectTo:"/admin/role" });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Server error', err });
  }
};
