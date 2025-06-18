import * as service from '../services/admin.User.service.js';
import { check, validationResult, body } from 'express-validator';


export const findAll = async (req, res) => {
  try {
    const { page, limit, offset } = req.pagination;

    const { data, totalPages } = await service.findAll({ limit, offset });

    res.render('admins/user_list', {
      users:data,
      currentPage: page,
      totalPages,
      pageTitle: 'Admin',
    });
  } catch (err) {
    res.status(500).render('errors/500', { error: err.message });
  }
};


export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).render('admins/user_update', {
      success: true,
      pageTitle: "Update Record",
      user: data
    });
  } catch (err) {
    res.status(404).render('errors/500', { error: err.message });
  }
};

  export const create = [
    
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

    
    try {
      const data = await service.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
]

export const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const destroy = async (req, res) => {
  try {
    const data = await service.destroy(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const renderCreate = async (req, res) => {
  try {
    res.status(200).render('admins/user_create', {
      pageTitle: "Create User"
    });
  } catch (err) {
    res.status(500).render('errors/500', { error: err.message });
  }
};