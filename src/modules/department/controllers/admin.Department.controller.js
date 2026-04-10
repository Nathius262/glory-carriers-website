import * as service from '../services/admin.Department.service.js';
import db from '../../../models/index.cjs';

export const findAll = async (req, res) => {
  const { page, limit, offset } = req.pagination
  try {
    const data = await service.findAll({ limit, offset });
    res.status(200).render('./admins/department_list', {
      success: true,
      pageTitle: "Admin",
      layout: "admin",
      PageTitle: "Admin",
      departments: data.departments,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findByIdWithRelations(req.params.id);
    res.status(200).render('./admins/department_update', {
      success: true,
      pageTitle: "Update Record",
      layout: "admin",
      PageTitle: "Admin",
      department: data,
    });
  } catch (err) {
    console.log(err)
    res.status(404).render('errors/404', { error: err });
  }
};

export const create = async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, redirectTo: "/admin/department", message: "Created successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.status(200).json({ success: true, data, redirectTo: `/admin/department/${req.params.id}`, message: "Updated successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const destroy = async (req, res) => {
  try {
    const data = await service.destroy(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully', redirectTo: "/admin/department" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const renderCreate = async (req, res) => {
  try {
    res.status(200).render('./admins/department_create', {
      pageTitle: "Create Department",
      layout: "admin",
      PageTitle: "Admin"
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};


export const createRole = async (req, res) => {
  try {
    const { department_id } = req.params;

    await service.createRole(department_id, req.body);

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      redirectTo: `/admin/department/${department_id}`
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const seedDefaultRoles = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;

    await service.createDefaultRoles(id, transaction);

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Default roles created successfully',
      redirectTo: `/admin/department/${id}`
    });

  } catch (error) {
    await transaction.rollback();

    console.log(error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const assignMember = async (req, res) => {
  try {
    const { user_id, department_id, role_id } = req.body;

    await service.assignMember({ user_id, department_id, role_id });

    res.status(201).json({
      success: true,
      message: "Member assigned successfully",
      redirectTo: `/admin/department/${department_id}`
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateMemberRole = async (req, res) => {
  try {
    const { user_id, role_id, department_id } = req.body;

    await service.updateMemberRole(user_id, role_id);

    res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      redirectTo: `/admin/department/${department_id}`
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { user_id } = req.body;

    await service.removeMember(user_id);

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      redirectTo: `/admin/department/${req.params.id}`
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const renderAssignMember = async (req, res) => {
  try {
    const department = await service.findByIdWithRelations(req.params.id);

    console.log("Department:", department);

    res.status(200).render('./admins/department_assign_member', {
      pageTitle: "Assign Member",
      layout: "admin",
      department
    });
  } catch (err) {
    console.log(err);
    res.status(500).render('errors/500', { error: err });
  }
};

export const renderUpdateMemberRole = async (req, res) => {
  try {
    const member = await service.findMemberById(req.params.member_id);

    if (!member) {
      return res.status(404).render('errors/404', { error: 'Member not found' });
    }

    res.status(200).render('./admins/department_update_member_role', {
      pageTitle: "Update Member Role",
      layout: "admin",
      member
    });
  } catch (err) {
    console.log(err);
    res.status(500).render('errors/500', { error: err });
  }
}

export const renderCreateDeparmentRole = async (req, res) => {
  try {
    const department = await service.findById(req.params.id);

    if (!department) {
      return res.status(404).render('errors/404', { error: 'Department not found' });
    }

    res.status(200).render('./admins/department_create_role', {
      pageTitle: "Create Department Role",
      layout: "admin",
      department
    });
  } catch (err) {
    console.log(err);
    res.status(500).render('errors/500', { error: err });
  }
}