import * as service from '../services/Role.service.js';

export const findAll = async (req, res) => {
  try {
    const data = await service.findAll();
    res.status(200).render('./list', {
      success: true,
      pageTitle: "",
      roles: data,
    });
  } catch (err) {
    res.status(500).render('error', { error: err.message });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).render('./single', {
      success: true,
      pageTitle: "Details",
      role: [data],
    });
  } catch (err) {
    res.status(404).render('error', { error: err.message });
  }
};