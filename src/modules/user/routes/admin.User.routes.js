import express from 'express';
import * as controller from '../controllers/admin.User.controller.js';

const router = express.Router();

// Admin routes
router.route('/')
    .get(controller.findAll)
    .post(controller.create);


router.get('/create', controller.render)

router.route('/:id')
    .get(controller.findById)
    .put(controller.update)
    .delete(controller.destroy);

export default router;
