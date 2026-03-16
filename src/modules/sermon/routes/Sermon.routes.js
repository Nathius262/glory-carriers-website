import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import {withPagination} from '../../../middlewares/paginations.js';
import * as controller from '../controllers/Sermon.controller.js';

const router = express.Router();

router.use(useModuleViews('sermon'));

// Public view routes
router.get('/', withPagination(10), controller.findAll);
router.get('/:id', controller.findById);

export default router;
