import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/Giving.controller.js';

const router = express.Router();

router.use(useModuleViews('giving'));

// Public view routes
router.get('/', controller.render_giving_view);

export default router;
