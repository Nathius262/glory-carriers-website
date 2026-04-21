import * as service from '../services/admin.Media.service.js';
import capitalizeWords from '../../../utils/utils.js';
import { getPublicIdFromUrl } from '../../../utils/utils.js'
import cloudinary from '../../../config/cloudinaryConfig.js';

/* ********
 * ********
 * NOW WORD
 * ********
 * *******/
export const findAllNowwords = async (req, res) => {
  const { page, limit, offset } = req.pagination
  try {
    const data = await service.findAllNowwords({ limit, offset });
    res.status(200).render('./nowword/nowword_list', {
      success: true,
      pageTitle: "Nowwords",
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

/* ********
 * ********
 * ZOE RECORD
 * ********
 * *******/

export const findAllZoeRecord = async (req, res) => {
  const { page, limit, offset } = req.pagination
  try {
    const data = await service.findAllZoeRecords({ limit, offset });
    res.status(200).render('./zoe_record/zoe_record_list', {
      success: true,
      PageTitle: "Zoe Records",
      zoe_records: data.zoe_records,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};
