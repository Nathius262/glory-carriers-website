import db from '../../../models/index.cjs';



export const findAll = async ({ limit, offset }) => {
  try {
    const { rows: departments, count: totalItems } = await db.Department.findAndCountAll({
      limit,
      offset,
      distinct: true,
      order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
    })
    return {
      departments,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    };
  } catch (error) {
    console.log(error)
    throw new Error('Error fetching records: ' + error.message);
  }
};

export const findById = async (id) => {
  try {
    const item = await db.Department.findByPk(id);

    if (!item) throw new Error('Not found');

    return item;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching record: ' + error.message);
  }
};


export const findByIdWithRelations = async (id) => {
  try {
    const item = await db.Department.findByPk(id, {
      include: [
        {
          model: db.DepartmentRole,
          as: 'roles'
        },
        {
          model: db.DepartmentMember,
          as: 'members',
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['id', 'email']
            },
            {
              model: db.DepartmentRole,
              as: 'role',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!item) throw new Error('Not found');

    return item;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching record: ' + error.message);
  }
};

export const create = async (data) => {
  try {
    return await db.Department.create(data);
  } catch (error) {
    console.log(error)
    throw new Error('Error creating record: ' + error.message);
  }
};

export const update = async (id, data) => {
  try {
    const item = await db.Department.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.update(data);
  } catch (error) {
    console.log(error)
    throw new Error('Error updating record: ' + error.message);
  }
};

export const destroy = async (id) => {
  try {
    const item = await db.Department.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.destroy();
  } catch (error) {
    console.log(error)
    throw new Error('Error deleting record: ' + error.message);
  }
};

export const createRole = async (department_id, data) => {
  try {

    return await db.DepartmentRole.create({
      ...data,
      department_id
    });
  } catch (error) {
    console.log(error);
    throw new Error('Error creating department role: ' + error.message);
  }
};

export const createDefaultRoles = async (department_id, transaction) => {
  try {
    // Prevent duplicates

    const existing = await db.DepartmentRole.count({
      where: { department_id },
      transaction
    });

    if (existing > 0) {
      return [];
    }

    const roles = await db.DepartmentRole.bulkCreate([
      { name: 'HOD', level: 1, department_id },
      { name: 'ASSISTANT', level: 2, department_id },
      { name: 'SECRETARY', level: 3, department_id },
      { name: 'TREASURER', level: 3, department_id },
      { name: 'MEMBER', level: 4, department_id }
    ], { transaction });

    return roles;

  } catch (error) {
    throw new Error('Error creating default roles: ' + error.message);
  }
};

export const findDepartmentRoles = async (department_id) => {
  try {
    return await db.DepartmentRole.findAll({
      where: { department_id }
    });
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching department roles: ' + error.message);
  }
}

export const assignMember = async ({ user_id, department_id, role_id }) => {
  try {
    // 🔥 Ensure user not already assigned
    const existing = await db.DepartmentMember.findOne({
      where: { user_id }
    });

    if (existing) {
      throw new Error('User already assigned to a department');
    }

    const role = await db.DepartmentRole.findByPk(role_id);

    if (role.name === 'HOD') {
      const existingHod = await db.DepartmentMember.findOne({
        where: { department_id, role_id }
      });

      if (existingHod) {
        throw new Error('Department already has an HOD');
      }
    }

    return await db.DepartmentMember.create({
      user_id,
      department_id,
      role_id,
      joined_at: new Date()
    });
  } catch (error) {
    console.log(error);
    throw new Error('Error assigning member: ' + error.message);
  }
};

export const updateMemberRole = async (user_id, role_id) => {
  try {
    const member = await db.DepartmentMember.findOne({
      where: { user_id }
    });

    if (!member) throw new Error('Member not found');

    return await member.update({ role_id });
  } catch (error) {
    console.log(error);
    throw new Error('Error updating member role: ' + error.message);
  }
};

export const removeMember = async (user_id) => {
  try {
    const member = await db.DepartmentMember.findOne({
      where: { user_id }
    });

    if (!member) throw new Error('Member not found');

    return await member.destroy();
  } catch (error) {
    console.log(error);
    throw new Error('Error removing member: ' + error.message);
  }
};

export const findMemberById = async (id) => {
  try {
    const member = await db.DepartmentMember.findByPk(id, {
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'email']
        },
        {
          model: db.DepartmentRole,
          as: 'role',
          attributes: ['id', 'name']
        },
        {
          model: db.Department,
          as: 'department',
          attributes: ['id', 'name'],
          include: [
            {
              model: db.DepartmentRole,
              as: 'roles'
            }
          ]
        }
      ]
    });

    if (!member) throw new Error('Not found');

    return member;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching record: ' + error.message);
  }
};