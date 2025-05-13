import db from '../../../models/index.cjs';
import bcrypt from 'bcryptjs';



export const findAll = async () => {
  try {
    return await db.User.findAll();
  } catch (error) {
    throw new Error('Error fetching records: ' + error.message);
  }
};

export const findById = async (id) => {
  try {
    const item = await db.User.findByPk(id);
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
    throw new Error('Error fetching record: ' + error.message);
  }
};

export const create = async ({ username, email, password, roleIds = [] }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = await db.Role.findOne({ where: { role_name: 'user' } });
    if (!userRole) throw new Error('Default role "User" not found');

    const newUser = await db.User.create({ username, email, password: hashedPassword });
    const allRoles = roleIds.length > 0 ? [userRole.id, ...roleIds] : [userRole.id];

    await newUser.setRoles(allRoles);

    const createdUser = await findById(newUser.id);
    return createdUser;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const item = await db.User.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.update(data);
  } catch (error) {
    throw new Error('Error updating record: ' + error.message);
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
