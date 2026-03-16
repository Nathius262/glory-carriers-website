import * as service from '../services/admin.User.service.js';

// controller.js

export const findAll = async (req, res) => {
  try {
    const { page, limit, offset } = req.pagination;

    const { data, totalPages } = await service.findAll({ limit, offset });

    res.render('admins/user_list', {
      layout: 'admin',
      users: data,
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
      layout: 'admin',
      pageTitle: "Update Record",
      user: data
    });
  } catch (err) {
    res.status(404).render('errors/500', { error: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, message: "User created successfully", data, redirectTo: `/admin/user` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.status(200).json({ success: true, message: "User updated successfully", data, redirectTo: `/admin/user/${req.params.id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const destroy = async (req, res) => {
  try {
    const data = await service.destroy(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully", message: 'Deleted successfully', data, redirectTo: `/admin/user` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const renderCreate = async (req, res) => {
  try {
    res.status(200).render('admins/user_create', {
      layout: 'admin',
      pageTitle: "Create User"
    });
  } catch (err) {
    res.status(500).render('errors/500', { error: err.message });
  }
};