import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/Sermon.controller.js';
import {withPagination} from '../../../middlewares/paginations.js'

const router = express.Router();

router.use(useModuleViews('sermon'));

// Public view routes
router.get('/', withPagination(20), controller.findAll);
//router.get('/:id', controller.findById);
router.get('/:slug', controller.findBySlug);

export default router;
