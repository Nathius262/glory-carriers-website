import * as service from '../services/Department.service.js';

export const findAll = async (req, res) => {
  const { page, limit, offset } = req.pagination
  try {
    const data = await service.findAll({ limit, offset });
    res.status(200).render('./department_list', {
      success: true,
      pageTitle: "Departments",
      departments: data.departments,
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
    res.status(200).render('./department_single', {
      success: true,
      pageTitle: "Details",
      layout: "admin",
      PageTitle: "Admin",
      department: data,
    });
  } catch (err) {
    console.log(err)
    res.status(404).render('errors/404', { error: err });
  }
};