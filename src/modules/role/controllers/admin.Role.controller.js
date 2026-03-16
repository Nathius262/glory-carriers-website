import * as service from '../services/admin.Role.service.js';

export const findAll = async (req, res) => {
  try {
    const data = await service.findAll();
    res.status(200).render('./admins/list', {
      layout: 'admin',
      success: true,
      pageTitle: "Admin",
      roles: data,
    });
  } catch (err) {
    res.status(500).render('error', { error: err.message });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).render('./admins/update', {
      layout: 'admin',
      success: true,
      pageTitle: "Update Record",
      role: data,
    });
  } catch (err) {
    res.status(404).render('error', { error: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, data, message: "Data created successfully", redirectTo: '/admin/role/create' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.status(200).json({ success: true, data, message: "Data updated successfully", redirectTo: '/admin/role/' + data.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const destroy = async (req, res) => {
  try {
    const data = await service.destroy(req.params.id);
    res.status(200).json({ success: true, message: "Data deleted successfully", data, redirectTo: '/admin/role' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const renderCreate = async (req, res) => {
  try {
    res.status(200).render('./admins/create', {
      layout: 'admin',
      pageTitle: "Create Role"
    });
  } catch (err) {
    res.status(500).render('error', { error: err.message });
  }
};

export const adminDashboard = async (req, res) => {
  try {
    const data = await service.adminMethod();
    res.status(200).render('./admins/dashboard', {
      layout: 'admin',
      pageTitle: "Admin Dashboard",
      data,
    });
  } catch (err) {
    res.status(500).render('error', { error: err.message });
  }
};