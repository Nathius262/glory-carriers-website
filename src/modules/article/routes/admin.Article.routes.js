import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import { withPagination } from '../../../middlewares/paginations.js';
import * as controller from '../controllers/admin.Article.controller.js';

import upload from '../../../config/multerConfig.js';
import setSection from '../../../middlewares/uploadLocation.js';

const router = express.Router();

router.use(useModuleViews('article'));

// =====================================================
// Article List
// =====================================================

router.route('/')
  .get(withPagination(10), controller.findAll)
  .post(
    setSection('articles'),
    upload.fields([
      {
        name: 'image',
        maxCount: 1
      }
    ]),
    controller.create
  );

// =====================================================
// Create Article
// =====================================================

router.route('/create')
  .get(controller.renderCreate)
  .post(
    setSection('articles'),
    upload.fields([
      {
        name: 'image',
        maxCount: 1
      }
    ]),
    controller.create
  );

// =====================================================
// Update / Delete Article
// =====================================================

router.route('/:id')
  .get(controller.findById)
  .put(
    setSection('articles'),
    upload.fields([
      {
        name: 'image',
        maxCount: 1
      }
    ]),
    controller.update
  )
  .delete(controller.destroy);

export default router;