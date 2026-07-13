import * as service from '../services/Project.service.js';

export const findAll = async (req, res) => {
  const {page, limit, offset} = req.pagination
  try {
    const data = await service.findAll({limit, offset});
    res.status(200).render('./project_list', {
      success: true,
      pageTitle: "",
      layout: "admin", 
      PageTitle: "Admin",
      projects: data.projects,
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
    res.status(200).render('./project_single', {
      success: true,
      pageTitle: "Details",
      layout: "admin", 
      PageTitle: "Admin",
      project: data,
    });
  } catch (err) {
  console.log(err)
    res.status(404).render('errors/404', { error: err });
  }
};