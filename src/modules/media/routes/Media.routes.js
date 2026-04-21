import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import { withPagination } from '../../../middlewares/paginations.js';
import * as controller from '../controllers/Media.controller.js';

const router = express.Router();

router.use(useModuleViews('media'));

// Public view routes
router.get('/nowword', withPagination(20), controller.findAllNowwords);
router.get('/zoe-record', withPagination(20), controller.findAllZoeRecord);

export default router;
