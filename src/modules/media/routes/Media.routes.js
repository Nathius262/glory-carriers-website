import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/Media.controller.js';
import * as nowwordController from '../controllers/Nowword.controller.js';
import * as zoeRecordController from '../controllers/Zoe_record.controller.js';
import {withPagination} from '../../../middlewares/paginations.js'

const router = express.Router();

router.use(useModuleViews('media'));

// Public view routes
router.get('/now-word/', withPagination(10), nowwordController.findAll);
router.get('/now-word/:id', nowwordController.findById);


router.get('/zoe-record/', withPagination(10), zoeRecordController.findAll);
router.get('/zoe-record/:id', zoeRecordController.findById);

export default router;
