import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import { withPagination } from '../../../middlewares/paginations.js';
import * as controller from '../controllers/admin.Department.controller.js';

const router = express.Router();

router.use(useModuleViews('department'));


// =========================
// DEPARTMENT CRUD
// =========================

router.route('/')
  .get(withPagination(10), controller.findAll)
  .post(controller.create);

router.route('/create')
  .get(controller.renderCreate)
  .post(controller.create);

router.route('/:id')
  .get(controller.findById)
  .put(controller.update)
  .delete(controller.destroy);


// =========================
// DEPARTMENT ROLES
// =========================

// Create role for a department
router.post('/:department_id/roles', controller.createRole);
router.post('/:id/seed-roles', controller.seedDefaultRoles);


// =========================
// DEPARTMENT MEMBERS
// =========================

// Assign member to department
router.post('/members', controller.assignMember);

// Update member role (promote/demote)
router.put('/members/role', controller.updateMemberRole);
router.get('/members/:member_id/role', controller.renderUpdateMemberRole);

// Remove member
router.delete('/members', controller.removeMember);


// =========================
// OPTIONAL VIEWS (ADMIN UI)
// =========================

// Render assign member page
router.get('/:id/assign-member', controller.renderAssignMember);
router.get('/members/:user_id/update-role', controller.renderUpdateMemberRole);

// Render create department role page
router.get('/:id/create-role', controller.renderCreateDeparmentRole);


export default router;