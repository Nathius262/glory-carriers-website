import express from 'express';
import * as controller from '../controllers/User.controller.js';
import useModuleViews from '../../../middlewares/moduleViews.js';

const router = express.Router();

router.use(useModuleViews('user'));


// Public view routes
router.get('/', controller.findAll);
router.get('/:id', controller.findById);

export default router;
