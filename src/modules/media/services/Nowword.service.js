import db from '../../../models/index.cjs';


export const findAll = async ({limit, offset}) => {
  try {
    const {rows: nowwords, count: totalItems } = await db.Nowword.findAndCountAll({
      limit,
      offset,
      distinct:true,
      order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
    });
    return {
      nowwords,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    };
  } catch (error) {
    throw new Error('Error fetching records: ' + error.message);
  }
};

export const findById = async (id) => {
  try {
    const item = await db.Nowword.findByPk(id);
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
    throw new Error('Error fetching record: ' + error.message);
  }
};
