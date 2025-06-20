import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/admin.Media.controller.js';
import * as nowwordController from '../controllers/admin.Nowword.controller.js'
import * as zoeRecordController from '../controllers/admin.Zoe_record.controller.js'
import {withPagination} from '../../../middlewares/paginations.js'
import upload from '../../../config/multerConfig.js';
import setSection from "../../../middlewares/uploadLocation.js";

const router = express.Router();

router.use(useModuleViews('media'));

// Admin view routes

//NOWORD
router.get('/nowword/', withPagination(10), nowwordController.findAll);

router.route('/nowword/create')
  .get(nowwordController.renderCreate)
  .post(setSection('now_word'),
    upload.fields([
      {name: 'file', maxCount:1}
    ]), nowwordController.create
  );

  router.route('/nowword/:id')
  .get(nowwordController.findById)
  .put(setSection('now_word'),
    upload.fields([
      {name: 'file', maxCount:1}
    ]), nowwordController.update
  )
  .delete(nowwordController.destroy);



//ZOE RECORD
router.get('/zoe-record/', withPagination(10), zoeRecordController.findAll);

router.route('/zoe-record/create')
  .get(zoeRecordController.renderCreate)
  .post(setSection('zoe_record'),
    upload.fields([
      {name: 'audio', maxCount:1},
      {name: 'image', maxCount:1}
    ]), zoeRecordController.create
  );

  router.route('/zoe-record/:id')
  .get(zoeRecordController.findById)
  .put(setSection('zoe_record'),
    upload.fields([
      {name: 'audio', maxCount:1},
      {name: 'image', maxCount:1}
    ]), zoeRecordController.update
  )
  .delete(zoeRecordController.destroy);

export default router;
