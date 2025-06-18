import express from 'express';
import userModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/admin.User.controller.js';

const router = express.Router();

router.use(useModuleViews('user'));

// Admin view routes
router.route('/')
  .get(controller.findAll)
  .post(controller.create);

router.get('/create', controller.renderCreate);

router.route('/:id')
  .get(controller.findById)
  .put(controller.update)
  .delete(controller.destroy);

export default router;
