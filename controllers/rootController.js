import pool from "../config/databaseConfig.js";

import { check, validationResult } from 'express-validator';
import dotenv from 'dotenv';

// Derive the equivalent of __dirname
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();


const page_logo = process.env.PAGELOGO

const renderIndex= async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM sermons ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2',
            [2, 0]
        );

        //console.log(result.rows)
        res.render('index', {
            sermons: result.rows,
            pageTitle: "Home",
            pageLogo: page_logo
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

const renderAbout = async (req, res) => {
    try {
        res.render('about', {pageTitle:"About ", pageLogo: page_logo});
        
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderContact = async (req, res) => {
    try {
        res.render('contact', {pageTitle: "Contact", pageLogo: page_logo});
        
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderEvent= async (req, res) => {
    try {
        res.render('event', {pageTitle: " Events", pageLogo: page_logo});
        
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const registerEvent = [
  // Validate input
  [
    check('name', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('gender', 'Gender is required').isIn(['male', 'female']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      phone,
      location,
      gender,
    } = req.body;

    try {
      const user = await pool.query('SELECT * FROM register_event WHERE email = $1', [email]);

      if (user.rows.length) {
        return res.status(400).json({ message: 'User already registered for this event' });
      }

      const newUser = await pool.query(
        `INSERT INTO register_event (
          name, email, phone, location, gender
        ) VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`,
        [
          name,
          email,
          phone,
          location,
          gender,
        ]
      );

      res.status(201).json({
        message: "Registration for Zoe Conference'25 was successful!",
        user: newUser.rows[0], // Return the newly created user data
      });

    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ error: 'Server error, please try again later.' });
    }
  },
];

const renderHealingSchool= async (req, res) => {
  try {
      res.render('healing_school', {pageTitle: " Healing School Registration", pageLogo: page_logo});
      
  } catch (error) {
      res.status(404).send('page not found');
  }
};

const registerHealingSchool = [
  // Validate input
  [
    check('name', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('gender', 'Gender is required').isIn(['male', 'female', 'other']),
    check('salvation', '').isIn(['yes', 'no']),
    check('health_status', "Your health state is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      phone,
      location,
      gender,
      salvation,
      health_status
    } = req.body;

    try {
      const user = await pool.query('SELECT * FROM healing_school WHERE email = $1', [email]);

      if (user.rows.length) {
        return res.status(400).json({ message: 'User already registered for this event' });
      }

      const newUser = await pool.query(
        `INSERT INTO healing_school (
          name, email, phone, location, gender, 
          salvation, health_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`,
        [
          name,
          email,
          phone,
          location,
          gender,
          salvation,
          health_status,
        ]
      );

      res.status(201).json({
        message: "Registration for Healing School was successful!",
        user: newUser.rows[0], // Return the newly created user data
      });

    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ error: 'Server error, please try again later.' });
    }
  },
];


const renderDepartment = async (req, res) => {
    
    try {
      
      // Query to select department name with pagination
      const result = await pool.query(
          'SELECT id, name, image_url FROM departments ORDER BY id',
      );

      // Return the department name with pagination info
      res.status(200).render('department', {
          pageTitle: " Department",
          pageLogo: page_logo,
          departments: result.rows,  // This will contain an array of department objects with their ids, emails, usernames, and departments
      });

  } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ message: 'Server error' });
  }
};

const joinDepartmentForm = async (req, res) => {
  const departmentId = req.params.id;

    try {
        // Check if the department exists
        const department = await pool.query('SELECT * FROM departments WHERE id = $1', [departmentId]);


        if (department.rows.length === 0) {
            return res.status(404).json({ message: 'name not found' });
        }

        res.render('join_department', { department: department.rows[0], pageTitle: "GCMI Admin", pageLogo: page_logo})
        

    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
}

const joinDepartment = [
  // Validate input
  [
    check('name', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('gender', 'Gender is required').isIn(['male', 'female']),
    check('department_id', "department id is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      phone,
      location,
      gender,
      department_id
    } = req.body;

    try {
      const user = await pool.query('SELECT * FROM department_members WHERE email = $1', [email]);

      if (user.rows.length) {
        return res.status(400).json({ message: 'Email already registered for a department' });
      }

      const newUser = await pool.query(
        `INSERT INTO department_members (
          name, email, phone, location, gender, department_id
        ) VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [
          name,
          email,
          phone,
          location,
          gender,
          department_id
        ]
      );

      res.status(201).json({
        message: "Registration was successful!",
        redirectTo: `/department/${department_id}`,
        user: newUser.rows[0], // Return the newly created user data
      });

    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ error: 'Server error, please try again later.' });
    }
  },
];

const renderGiving = async (req, res) => {
    try {
        res.render('giving', {pageTitle: "Giving", pageLogo: page_logo});
        
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderSitemap = async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '..', 'views', 'sitemap.xml'));
    } catch (error) {
        res.status(404).send('page not found');
    }
};



export {renderIndex, renderSitemap, renderAbout, renderContact, renderDepartment, joinDepartmentForm, joinDepartment, renderEvent, registerEvent, registerHealingSchool, renderHealingSchool, renderGiving}