import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/Mentorship.controller.js';

const router = express.Router();

router.use(useModuleViews('mentorship'));

// Public view routes
router.get('/', controller.mentorship_form);
router.post('/', controller.create);

export default router;
