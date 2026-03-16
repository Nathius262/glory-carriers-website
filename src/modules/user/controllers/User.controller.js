import * as service from '../services/User.service.js';

export const findAll = async (req, res) => {
  try {
    const { page, limit, offset } = req.pagination;

    const { data, totalPages } = await service.findAll({ limit, offset });

    res.render('./product_list', {
      users:data,
      currentPage: page,
      totalPages,
      pageTitle: 'Users List',
    });
  } catch (err) {
    res.status(500).render('errors/500', { error: err.message });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).render('./product_single', {
      success: true,
      pageTitle: "Details",
      user: [data],
    });
  } catch (err) {
    res.status(404).render('error', { error: err.message });
  }
};