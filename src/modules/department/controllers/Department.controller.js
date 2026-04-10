import * as service from '../services/Department.service.js';
import db from '../../../models/index.cjs';
import * as userService from '../../user/services/admin.User.service.js';
import * as memberService from '../services/Department.service.js';

export const register = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      email,
      password,
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      address,
      occupation,
      gender,
      department_id
    } = req.body;

    // 1. Create user + profile
    const user = await userService.create({
      email,
      password,
      profile: {
        first_name,
        last_name,
        date_of_birth,
        phone_number,
        address,
        occupation,
        gender
      },
      transaction
    });

    // 2. Assign membership
    await memberService.createMember({
      user_id: user.id,
      department_id,
      transaction
    });

    // ✅ Commit everything
    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Registration successful"
    });

  } catch (error) {
    // ❌ Rollback everything
    await transaction.rollback();

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const findAll = async (req, res) => {
  const { page, limit, offset } = req.pagination
  try {
    const data = await service.findAll({ limit, offset });
    res.status(200).render('./department_list', {
      success: true,
      pageTitle: "Departments",
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
    const data = await service.findById(req.params.id);
    res.status(200).render('./department_single', {
      success: true,
      pageTitle: "Join Our Team",
      department: data,
    });
  } catch (err) {
    console.log(err)
    res.status(404).render('errors/404', { error: err });
  }
};