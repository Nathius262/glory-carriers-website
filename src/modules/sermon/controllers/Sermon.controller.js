import * as service from '../services/Sermon.service.js';

export const findAll = async (req, res) => {
  const {page, limit, offset} = req.pagination
  try {
    const data = await service.findAll({limit, offset});
    res.status(200).render('./sermon_list', {
      success: true,
      pageTitle: "Sermon List",
      sermons: data.sermons,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err.message });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).render('./sermon_detail', {
      success: true,
      pageTitle: "Sermon Detail",
      sermon: data,
    });
  } catch (err) {
    res.status(404).render('errors/404', { error: err.message });
  }
};


export const findBySlug = async (req, res) => {
  try {
    const data = await service.findBySlug(req.params.slug);
    res.status(200).render('./sermon_detail', {
      success: true,
      pageTitle: "Sermon Detail",
      sermon: data,
    });
  } catch (err) {
    res.status(404).render('errors/404', { error: err.message });
  }
};