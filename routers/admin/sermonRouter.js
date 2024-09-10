import { Router } from 'express';
import upload from '../../config/multerConfig.js';
import { createSermonAdmin, renderMultipleForm, createMultipleSermonsAdmin, renderSermonPage, getAllSermonsAdmin, getSingleSermonAdmin, updateSermonAdmin, deleteSermonAdmin} from '../../controllers/admin/sermon.js';

const router = Router();

//user route
router.route('/')
    .get(getAllSermonsAdmin);

router.route('/create')
    .get(renderSermonPage)
    .post(upload.fields([
        {name: 'audio', maxCount:1},
        {name: 'image', maxCount:1}
    ]), createSermonAdmin);


router.route('/create-multiple')
    .get(renderMultipleForm)
    .post(upload.fields([
        {name: 'audio', maxCount:100},
        {name: 'image', maxCount:100}
    ]), createMultipleSermonsAdmin);

router.route('/:id')
    .get(getSingleSermonAdmin)
    .put(upload.fields([
        {name: 'audio', maxCount:1},
        {name: 'image', maxCount:1}
    ]), updateSermonAdmin)
    .delete(deleteSermonAdmin);
    
export default router;