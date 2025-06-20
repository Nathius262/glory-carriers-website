import * as service from '../services/Nowword.service.js';

export const findAll = async (req, res) => {
  const {page, limit, offset} = req.pagination
  try {
    const data = await service.findAll({limit, offset});
    res.status(200).render('./nowword/nowword_list', {
      success: true,
      pageTitle: "Nowword List",
      nowwords: data.nowwords,
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
    res.status(200).render('./nowword/nowword_detail', {
      success: true,
      pageTitle: "Nowword Detail",
      nowword: data,
    });
  } catch (err) {
    res.status(404).render('errors/404', { error: err.message });
  }
};