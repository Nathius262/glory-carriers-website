import { Router } from 'express';
import upload from '../../config/multerConfig.js';
import setSection from "../../middlewares/uploadLocation.js";
import { createNowwordAdmin, renderNowwordPage, getSingleNowwordAdmin, getAllNowword, updateNowwordAdmin, deleteNowwordAdmin} from '../../controllers/admin/nowword.js';

const router = Router();

//user route
router.route('/')
    .get(getAllNowword);

router.route('/create')
    .get(renderNowwordPage)
    .post(
        setSection('now_word'), 
        upload.fields([{name: 'file', maxCount:1}]), 
        createNowwordAdmin
    );

router.route('/:id')
    .get(getSingleNowwordAdmin)
    .put(setSection('now_word'), upload.fields([
        {name: 'file', maxCount:1}
    ]), updateNowwordAdmin)
    .delete(deleteNowwordAdmin);
    
export default router;