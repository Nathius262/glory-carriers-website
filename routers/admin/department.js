import { Router } from 'express';
import upload from '../../config/multerConfig.js';
import setSection from "../../middlewares/uploadLocation.js";
import { createdepartment, getAllDepartment, updateDepartment, deleteDepartment, renderCreateDepartment, renderUpdatePage } from '../../controllers/admin/department.js'; 

const router = Router();

//departmental route
router.route('/')
    .get(getAllDepartment);

router.route('/create')
    .get(renderCreateDepartment)
    .post(
        setSection('department'), 
        upload.fields([{name: 'image', maxCount:1}]), 
        createdepartment
    );

router.route('/:id')
    .get(renderUpdatePage)
    .put(setSection('department'), upload.fields([
        {name: 'image', maxCount:1}
    ]), updateDepartment)
    .delete(deleteDepartment);
    
export default router;