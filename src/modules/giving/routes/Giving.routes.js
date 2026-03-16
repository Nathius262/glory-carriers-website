import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import * as controller from '../controllers/Giving.controller.js';
import cors from 'cors';
import * as apiController from '../controllers/api/Giving.controller.js';
import { getCorsOptions } from '../../../utils/cors_config.js';

const router = express.Router();

router.use(useModuleViews('giving'));

// Public view routes
router.get('/', controller.render_giving_view);

// API routes
router.route('/api/paystack-key')
    .get(cors(getCorsOptions()), apiController.getPayStackPublicKey);
//.post(apiController.create);


router.route('/api/verify-payment')
    .get(apiController.verify_paystack_transaction_view);


export default router;
