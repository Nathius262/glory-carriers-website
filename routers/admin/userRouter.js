import { createUser, getAllUsers, updateUser, deleteUser, renderCreateUser, renderUpdatePage} from '../../controllers/admin/user.js';
import { Router } from 'express';

const router = Router();

//user route
router.route('/')
    .get(getAllUsers);

router.route('/create')
    .get(renderCreateUser)
    .post(createUser);

router.route('/:slug')
    .get(renderUpdatePage)
    .put(updateUser)
    .delete(deleteUser);
    
export default router;