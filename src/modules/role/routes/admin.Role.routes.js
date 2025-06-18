import express from 'express';
import * as controller from '../controllers/admin.Role.controller.js';
import useModuleViews from '../../../middlewares/moduleViews.js';

const router = express.Router();

router.use(useModuleViews('role'));
// Admin view routes
router.route('/')
  .get(controller.findAll);

router.route('/create') 
  .get(controller.renderCreate)
  .post(controller.create);

router.get('/dashboard', controller.adminDashboard);

router.route('/:id')
  .get(controller.findById)
  .put(controller.update)
  .delete(controller.destroy);

export default router;
