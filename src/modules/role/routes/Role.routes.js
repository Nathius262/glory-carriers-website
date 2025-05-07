import express from 'express';
import * as controller from '../controllers/Role.controller.js';

const router = express.Router();

// Public routes
router.get('/', controller.findAll);
router.get('/:id', controller.findById);

export default router;
