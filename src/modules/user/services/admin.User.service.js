import db from '../../../models/index.cjs';
import bcrypt from 'bcryptjs';

export const findAll = async ({ limit, offset }) => {
  try {
    const { rows: data, count } = await db.User.findAndCountAll({
      attributes: { exclude: ['password'] }, // Exclude sensitive fields
      include: {
        model: db.Role,
        as: 'roles',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return { data, totalPages };
  } catch (err) {
    throw new Error('Error fetching records: ' + err.message);
  }
};


export const findById = async (id) => {
  try {
    const item = await db.User.findByPk(id,
      {
        attributes: { exclude: ['password'] }, // Exclude sensitive fields
        include: [{
          model: db.Role,
          as: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }, {
          model: db.Profile,
          as: 'profile',
          attributes: ['first_name', 'last_name', 'phone_number']
        }]
      });
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
    throw new Error('Error fetching record: ' + error.message);
  }
};

export const create = async ({
  email,
  password,
  role_ids = [],
  profile = {},
  transaction
}) => {
  try {
    const hashed_password = await bcrypt.hash(password, 10);

    const user_role = await db.Role.findOne({
      where: { name: 'user' },
      transaction
    });

    if (!user_role) throw new Error("default role 'user' not found");

    const new_user = await db.User.create({
      email,
      password: hashed_password
    }, { transaction });

    const user_assigned_roles =
      role_ids.length > 0
        ? [user_role.id, ...role_ids]
        : [user_role.id];

    await new_user.setRoles(user_assigned_roles, { transaction });

    await db.Profile.create({
      user_id: new_user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone_number: profile.phone_number,
      address: profile.address,
      occupation: profile.occupation,
      gender: profile.gender,
      date_of_birth: profile.date_of_birth
    }, { transaction });

    return new_user;

  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
};


export const update = async (id, { email, last_name, first_name, is_user, is_staff, is_admin }) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();

    const item = await db.User.findByPk(id, { transaction });
    if (!item) {
      throw new Error('User not found');
    }

    const update_user = await item.update({ email, last_name, first_name }, { transaction });

    // Fetch all needed roles in a single query
    const roleNames = ['user'];
    if (is_admin) roleNames.push('admin');
    if (is_staff) roleNames.push('staff');
    if (is_user) roleNames.push('user');

    const roles = await db.Role.findAll({
      where: { name: roleNames },
      transaction
    });

    if (roles.length === 0) {
      throw new Error('No valid roles found');
    }

    // Update user roles
    await update_user.setRoles(roles, { transaction });

    // Commit the transaction
    await transaction.commit();

    // Return the updated user with roles
    const updatedUser = await db.User.findByPk(id, {
      include: {
        model: db.Role,
        as: 'roles',
        through: { attributes: [] }
      }
    });
    return updatedUser;
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error updating user:', error);

    // Differentiate between not found and other errors
    if (error.message === 'User not found') {
      throw error; // Re-throw as is
    }
    throw new Error(`Error updating user: ${error.message}`);
  }
};

export const destroy = async (id) => {
  try {
    const item = await db.User.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.destroy();
  } catch (error) {
    throw new Error('Error deleting record: ' + error.message);
  }
};

export const adminMethod = async () => {
  return 'Admin-specific logic here';
};