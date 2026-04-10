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

export const createMember = async ({
  user_id,
  department_id,
  transaction
}) => {
  try {
    const memberRole = await db.DepartmentRole.findOne({
      where: {
        department_id,
        name: 'MEMBER'
      },
      transaction
    });

    if (!memberRole) {
      throw new Error('Default MEMBER role not found for this department');
    }

    const existing = await db.DepartmentMember.findOne({
      where: { user_id },
      transaction
    });

    if (existing) {
      throw new Error('User already assigned to a department');
    }

    return await db.DepartmentMember.create({
      user_id,
      department_id,
      role_id: memberRole.id,
      joined_at: new Date()
    }, { transaction });

  } catch (error) {
    throw new Error('Error creating membership: ' + error.message);
  }
};