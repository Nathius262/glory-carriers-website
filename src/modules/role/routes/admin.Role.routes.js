import express from 'express';
import * as controller from '../controllers/admin.Role.controller.js';

const router = express.Router();

// Admin routes
router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/dashboard', controller.adminDashboard);

export default router;
