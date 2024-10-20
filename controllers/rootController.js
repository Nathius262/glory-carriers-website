import pool from "../config/databaseConfig.js";

import { check, validationResult } from 'express-validator';

// Derive the equivalent of __dirname
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const renderIndex= async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM sermons ORDER BY date DESC LIMIT $1 OFFSET $2',
            [2, 0]
        );

        //console.log(result.rows)
        res.render('index', {
            sermons: result.rows,
            pageTitle: "Home"
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

const renderAbout = async (req, res) => {
    try {
        res.render('about', {pageTitle:"About "});
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderContact = async (req, res) => {
    try {
        res.render('contact', {pageTitle: "Contact"});
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderEvent= async (req, res) => {
    try {
        res.render('event', {pageTitle: " Events"});
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
    check('occupation', 'Occupation is required').not().isEmpty(),
    check('gender', 'Gender is required').isIn(['male', 'female']),
    check('marital_status', 'Marital status is required').isIn(['single', 'married', 'divorced']),
    check('salvation', 'Salvation status is required').isIn(['yes', 'no', 'not_sure']),
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
      occupation,
      gender,
      marital_status,
      salvation,
    } = req.body;

    try {
      const user = await pool.query('SELECT * FROM register_event WHERE email = $1', [email]);

      if (user.rows.length) {
        return res.status(400).json({ message: 'User already registered for this event' });
      }

      const newUser = await pool.query(
        `INSERT INTO register_event (
          name, email, phone, location, occupation, gender, 
          marital_status, salvation
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`,
        [
          name,
          email,
          phone,
          location,
          occupation,
          gender,
          marital_status,
          salvation,
        ]
      );

      res.status(201).json({
        message: "Registration for Kabod '24 was successful!",
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
      res.render('healing_school', {pageTitle: " Healing School Registration"});
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
    check('occupation', 'Occupation is required').not().isEmpty(),
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
      occupation,
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
          name, email, phone, location, occupation, gender, 
          salvation, health_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`,
        [
          name,
          email,
          phone,
          location,
          occupation,
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
        res.render('department', {pageTitle: " Department"});
    } catch (error) {
        res.status(404).send('page not found');
    }
};

const renderGiving = async (req, res) => {
    try {
        res.render('giving', {pageTitle: "Giving"});
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



export {renderIndex, renderSitemap, renderAbout, renderContact, renderDepartment, renderEvent, registerEvent, registerHealingSchool, renderHealingSchool, renderGiving}