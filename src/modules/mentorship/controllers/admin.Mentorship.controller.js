import * as service from '../services/admin.Mentorship.service.js';

export const findAll = async (req, res) => {
  const {page, limit, offset} = req.pagination
  try {
    const data = await service.findAll({limit, offset});
    res.status(200).render('./admins/mentorship_list', {
      success: true,
      pageTitle: "Admin",
      mentorships: data.mentorships,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page
    });
  } catch (err) {
  console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).render('./admins/mentorship_update', {
      success: true,
      pageTitle: "Update Record",
      mentorship: data,
    });
  } catch (err) {
  console.log(err)
    res.status(404).render('errors/404', { error: err });
  }
};

export const create = async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const destroy = async (req, res) => {
  try {
    const data = await service.destroy(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully', data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const renderCreate = async (req, res) => {
  try {
    res.status(200).render('./admins/mentorship_create', {
      pageTitle: "Create Mentorship"
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};