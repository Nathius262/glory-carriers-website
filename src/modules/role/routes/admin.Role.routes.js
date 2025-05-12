import express from 'express';
import * as controller from '../controllers/admin.Role.controller.js';

const router = express.Router();

// Admin routes
router.get('/', controller.findAll);


router.route('/create')
    .get(controller.render_create_view)
    .post(controller.create);


router.route('/:id')
    .get(controller.findById)
    .put(controller.update)
    .delete(controller.destroy);
    
export default router;
