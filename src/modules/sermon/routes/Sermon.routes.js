import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import { withPagination } from '../../../middlewares/paginations.js';
import * as controller from '../controllers/Sermon.controller.js';

const router = express.Router();

router.use(useModuleViews('sermon'));

// Public view routes
router.get('/', withPagination(40), controller.findAll);
router.get('/:slug', controller.findBySlug);
router.get('/:id', controller.findById);

export default router;
