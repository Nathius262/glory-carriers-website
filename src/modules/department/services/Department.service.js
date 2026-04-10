import db from '../../../models/index.cjs';



export const findAll = async ({limit, offset}) => {
  try {
    const {rows: departments, count: totalItems } = await db.Department.findAndCountAll({
      limit,
      offset,
      distinct:true,
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