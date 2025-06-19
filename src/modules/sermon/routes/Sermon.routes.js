import express from 'express';
import userModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/Sermon.controller.js';

const router = express.Router();

router.use(useModuleViews('sermon'));

// Public view routes
router.get('/', controller.findAll);
router.get('/:id', controller.findById);

export default router;
