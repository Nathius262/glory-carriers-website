import { Router } from 'express';
import upload from '../../config/multerConfig.js';
import setSection from "../../middlewares/uploadLocation.js";
import {getAllRecordsAdmin, createRecordsAdmin, getSingleRecordsAdmin, renderRecordsPage, deleteRecordsAdmin, updateRecordsAdmin} from '../../controllers/admin/zoe_record.js'

const router = Router();

//user route
router.route('/')
    .get(getAllRecordsAdmin);

router.route('/create')
    .get(renderRecordsPage)
    .post(
        setSection('zoe_record'), 
        upload.fields([
            {name: 'audio', maxCount:1},
            {name: 'image', maxCount:1}
        ]), 
        createRecordsAdmin
    );

router.route('/:id')
    .get(getSingleRecordsAdmin)
    .put(setSection('zoe_record'), upload.fields([
        {name: 'audio', maxCount:1},
        {name: 'image', maxCount:1}                
    ]), updateRecordsAdmin)
    .delete(deleteRecordsAdmin);
    
export default router;