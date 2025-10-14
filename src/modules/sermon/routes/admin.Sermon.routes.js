import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/admin.Sermon.controller.js';
import {withPagination} from '../../../middlewares/paginations.js'
import upload from '../../../config/multerConfig.js';
import setSection from "../../../middlewares/uploadLocation.js";

const router = express.Router();

router.use(useModuleViews('sermon'));

// Admin view routes
router.route('/')
  .get(withPagination(20), controller.findAll)
  

router.route('/create') 
  .get(controller.renderCreate)
  .post(setSection('sermons'),
    upload.fields([
      {name: 'audio', maxCount:1},
      {name: 'image', maxCount:1}
    ]), controller.create
  );

router.route('/:id')
  .get(controller.findById)
  .put(setSection('sermons'),
    upload.fields([
      {name: 'audio', maxCount:1},
      {name: 'image', maxCount:1}
    ]),controller.update
  )
  .delete(controller.destroy);

export default router;
