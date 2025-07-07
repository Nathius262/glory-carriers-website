import express from 'express';
import cors from 'cors';
import * as controller from '../controllers/api/Giving.controller.js';
import { getCorsOptions } from '../../../utils/cors_config.js';


const router = express.Router();

// API routes
router.route('/paystack-key')
  .get(cors(getCorsOptions()), controller.getPayStackPublicKey);
  //.post(controller.create);


router.route('/verify-payment')
  .get(controller.verify_paystack_transaction_view);

export default router;
