import jwt from 'jsonwebtoken';
import pool from '../config/databaseConfig.js';


export const verifyToken = async (req, res, next) => {
  //const token = req.headers['authorization'];
  const token = req.cookies.token;

  if (!token) {
    //res.status(403).json({ message: 'No token provided' });
    return res.status(403).redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user roles from the database
    const userQuery = await pool.query('SELECT id, username, user_roles FROM users WHERE id = $1', [userId]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userQuery.rows[0];

    // Fetch role names based on role IDs
    const rolesQuery = await pool.query('SELECT role_name FROM roles WHERE id = ANY($1)', [user.user_roles]);

    // Attach roles to the req.user object
    req.user = {
      id: user.id,
      username: user.username,
      roles: rolesQuery.rows.map(role => role.role_name), // This will be an array of role names, e.g., ['user', 'admin']
    };

    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.roles.includes('admin') || !req.user.roles.includes('staff')) {
    return res.status(403).json({ message: 'Access denied; You must be logged in as an admin or staff' });
  }
  next();
};

