import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/Media.controller.js';
import {withPagination} from '../../../middlewares/paginations.js'

const router = express.Router();

router.use(useModuleViews('media'));

// Public view routes
router.get('/', controller.findAll);
router.get('/:id', controller.findById);

export default router;
