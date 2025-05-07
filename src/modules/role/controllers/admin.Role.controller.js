import * as service from '../services/admin.Role.service.js';

export const create = async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

export const delete = async (req, res) => {
  try {
    const data = await service.delete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminDashboard = async (req, res) => {
  try {
    const data = await service.adminMethod();
    res.status(200).json({ message: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};