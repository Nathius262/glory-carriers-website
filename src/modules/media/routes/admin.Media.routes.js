import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/admin.Media.controller.js';
import * as nowwordController from '../controllers/admin.Nowword.controller.js'
import {withPagination} from '../../../middlewares/paginations.js'
import upload from '../../../config/multerConfig.js';
import setSection from "../../../middlewares/uploadLocation.js";

const router = express.Router();

router.use(useModuleViews('media'));

// Admin view routes
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

export default router;
