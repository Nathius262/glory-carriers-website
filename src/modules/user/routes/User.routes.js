import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/User.controller.js';

const router = express.Router();

router.use(useModuleViews('user'));

// Public view routes
router.get('/', controller.findAll);
router.get('/:id', controller.findById);

export default router;
