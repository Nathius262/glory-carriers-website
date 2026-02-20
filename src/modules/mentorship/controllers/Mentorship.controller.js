import * as service from '../services/Mentorship.service.js';

export const create = async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const mentorship_form = (req, res) => {
  try {
    res.render('mentorship_form', { pageTitle: 'Mentorship Form' });
  } catch (error) {
    console.log(error);
    res.status(404).render('error/404', { pageTitle: 'Page Not Found' });
  }
}