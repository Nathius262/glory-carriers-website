import * as service from '../services/admin.Role.service.js';
import { check, validationResult } from 'express-validator';


export const create =[
  [
    check('role_name', 'Name is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const data = await service.create(req.body);
      res.status(201).json({
        message: 'Role created successfully',
        redirectTo: "/admin/role",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

export const findAll = async (req, res) => {
  try {
    const data = await service.findAll();
    res.status(200).render('./admins/list', {
      success: true,
      pageTitle:"GCMI Admin",
      roles: data,  // This will contain an array of user objects with their ids, emails, usernames, and roles
    });
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
    const data = await service.delete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//render create page
export const render_create_view = async (req, res) => {
  try {
    res.render('create', {pageTitle:"GCMI Admin"})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
