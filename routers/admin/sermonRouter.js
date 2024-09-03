import { Router } from 'express';
import { createSermonAdmin, renderSermonPage, getAllSermonsAdmin, getSingleSermonAdmin, updateSermonAdmin, deleteSermonAdmin} from '../../controllers/admin/sermon.js';

const router = Router();

//user route
router.route('/')
    .get(getAllSermonsAdmin);

router.route('/create')
    .get(renderSermonPage)
    .post(createSermonAdmin);

router.route('/:id')
    .get(getSingleSermonAdmin)
    .put(updateSermonAdmin)
    .delete(deleteSermonAdmin);
    
export default router;