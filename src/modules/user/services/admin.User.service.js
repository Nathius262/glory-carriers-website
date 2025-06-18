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
      include: {
        model: db.Role,
        as: 'roles',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }
    });
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
    throw new Error('Error fetching record: ' + error.message);
  }
};

export const create = async ({username, email, password, roleIds=[]}) => {
  try {

    const hashed_password = await bcrypt.hash(password, 10);
    const user_role = await db.Role.findOne({where: {name: 'user'}});
    if (!user_role) throw new Error("default role 'user' not found");

    const new_user = await db.User.create({username, email, password:hashed_password});

    const user_assigned_roles =  roleIds.length > 0 ? [user_role.id, ...roleIds]: [user_role.id];
    await new_user.setRoles(user_assigned_roles);
    const created_user = await findById(new_user.id);
    
    return created_user;

  } catch (error) {
    throw new Error('Error creating record: ' + error.message);
  }
};


export const update = async (id, { email, username, is_staff, is_admin }) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    
    const item = await db.User.findByPk(id, { transaction });
    if (!item) {
      throw new Error('User not found');
    }

    const update_user = await item.update({ email, username }, { transaction });

    // Fetch all needed roles in a single query
    const roleNames = ['user'];
    if (is_admin) roleNames.push('admin');
    if (is_staff) roleNames.push('staff');
    
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