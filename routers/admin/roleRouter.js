import { createrole, renderCreateRole, updaterole, deleteRole, getAllRole, renderUpdatePage} from '../../controllers/admin/roles.js';
import { Router } from 'express';

const router = Router();

//user route
router.route('/')
    .get(getAllRole);

router.route('/create')
    .get(renderCreateRole)
    .post(createrole);

router.route('/:id')
    .get(renderUpdatePage)
    .put(updaterole)
    .delete(deleteRole);
    
export default router;