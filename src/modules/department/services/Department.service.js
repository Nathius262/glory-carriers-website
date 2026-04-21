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
    console.log(error)
    throw new Error('Error fetching record: ' + error.message);
  }
};

export const createMember = async ({ user_id, department_id, transaction }) => {
  try {
    const memberRole = await db.DepartmentRole.findOne({
      where: { department_id, name: 'MEMBER' },
      transaction
    });

    if (!memberRole) throw new Error('Default MEMBER role not found');

    // SEARCH BY USER_ID ONLY to avoid unique constraint collisions
    const [member, created] = await db.DepartmentMember.findOrCreate({
      where: { user_id },
      defaults: {
        department_id,
        role_id: memberRole.id,
        joined_at: new Date()
      },
      transaction
    });

    // If it wasn't created, check if it's the SAME department or a different one
    if (!created && member.department_id !== department_id) {
      throw new Error('User is already a member of another department');
    }

    return member;
  } catch (error) {
    // Check if it's a Sequelize Validation Error to get a better message
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error(`Error: ${error.errors[0].message}`);
    }
    throw error;
  }
};
