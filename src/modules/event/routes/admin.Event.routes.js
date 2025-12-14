import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/admin.Event.controller.js';
import {withPagination} from '../../../middlewares/paginations.js'
import upload from '../../../config/multerConfig.js';
import setSection from "../../../middlewares/uploadLocation.js";


const router = express.Router();

router.use(useModuleViews('event'));

// Admin view routes

router.get('/', withPagination(12), controller.findAll);


router.route('/create')
  .get(controller.renderCreate)
  .post(setSection('events'),
    upload.fields([
      {name: 'image', maxCount:1}
    ]), controller.create
  );



router.route('/:id')
  .get(controller.findById)
  .put(setSection('events'),
    upload.fields([
      {name: 'image', maxCount:1}
    ]), controller.update
  )
  .delete(controller.destroy);


  //rvps
  router.route('/rvp')
  .get(withPagination(12), controller.findAllRvps);
  
export default router;
