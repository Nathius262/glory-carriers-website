import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/Event.controller.js';

const router = express.Router();

router.use(useModuleViews('event'));

// Public view routes
router.get('/', controller.render_event_view);

export default router;
