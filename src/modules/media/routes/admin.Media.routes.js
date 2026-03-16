import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/admin.Media.controller.js'
import { withPagination } from '../../../middlewares/paginations.js'
import upload from '../../../config/multerConfig.js';
import setSection from "../../../middlewares/uploadLocation.js";

const router = express.Router();

router.use(useModuleViews('media'));

// Admin view routes

//NOWORD
router.get('/nowword/', withPagination(10), controller.findAllNowwords);

router.route('/nowword/create')
  .get(controller.renderCreateNowword)
  .post(setSection('now_word'),
    upload.fields([
      { name: 'file', maxCount: 1 }
    ]), controller.createNowword
  );

router.route('/nowword/:id')
  .get(controller.findByIdNowword)
  .put(setSection('now_word'),
    upload.fields([
      { name: 'file', maxCount: 1 }
    ]), controller.updateNowword
  )
  .delete(controller.destroyNowword);



//ZOE RECORD
router.get('/zoe-record/', withPagination(10), controller.findAllZoeRecord);

router.route('/zoe-record/create')
  .get(controller.renderCreateZoeRecord)
  .post(setSection('zoe_record'),
    upload.fields([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 }
    ]), controller.createZoeRecord
  );

router.route('/zoe-record/:id')
  .get(controller.findByIdZoeRecord)
  .put(setSection('zoe_record'),
    upload.fields([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 }
    ]), controller.updateZoeRecord
  )
  .delete(controller.destroyZoeRecord);

export default router;
