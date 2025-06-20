import db from '../../../models/index.cjs';



export const findAll = async ({limit, offset}) => {
  try {
    const {rows: zoe_records, count: totalItems } = await db.ZoeRecord.findAndCountAll({
      limit,
      offset,
      distinct:true,
      order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
    });
    return {
      zoe_records,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    };
  } catch (error) {
    throw new Error('Error fetching records: ' + error.message);
  }
};

export const findById = async (id) => {
  try {
    const item = await db.ZoeRecord.findByPk(id);
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
    throw new Error('Error fetching record: ' + error.message);
  }
};