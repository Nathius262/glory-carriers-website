import db from '../../../models/index.cjs';


/* ********
 * ********
 * NOW WORD
 * ********
 * *******/

export const findAllNowwords = async ({ limit, offset }) => {
  try {
    const { rows: nowwords, count: totalItems } = await db.Nowword.findAndCountAll({
      limit,
      offset,
      distinct: true,
      order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
    })
    return {
      nowwords,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    };
  } catch (error) {
    console.log(error)
    throw new Error('Error fetching records: ' + error.message);
  }
};

export const findByIdNowword = async (id) => {
  try {
    const item = await db.Nowword.findByPk(id);
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
    console.log(error)
    throw new Error('Error fetching record: ' + error.message);
  }
};

export const createNowword = async (data) => {
  try {
    return await db.Nowword.create(data);
  } catch (error) {
    console.log(error)
    throw new Error('Error creating record: ' + error.message);
  }
};

export const updateNowword = async (id, data) => {
  try {
    const item = await db.Nowword.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.update(data);
  } catch (error) {
    console.log(error)
    throw new Error('Error updating record: ' + error.message);
  }
};

export const destroyNowword = async (id) => {
  try {
    const item = await db.Nowword.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.destroy();
  } catch (error) {
    console.log(error)
    throw new Error('Error deleting record: ' + error.message);
  }
};


/* ********
 * ********
 * ZOE RECORD
 * ********
 * *******/
export const findAllZoeRecords = async ({ limit, offset }) => {
  try {
    const { rows: zoe_records, count: totalItems } = await db.ZoeRecord.findAndCountAll({
      limit,
      offset,
      distinct: true,
      order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
    })
    return {
      zoe_records,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    };
  } catch (error) {
    console.log(error)
    throw new Error('Error fetching records: ' + error.message);
  }
};

export const findByIdZoeRecords = async (id) => {
  try {
    const item = await db.ZoeRecord.findByPk(id);
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
    console.log(error)
    throw new Error('Error fetching record: ' + error.message);
  }
};

export const createZoeRecords = async (data) => {
  try {
    return await db.ZoeRecord.create(data);
  } catch (error) {
    console.log(error)
    throw new Error('Error creating record: ' + error.message);
  }
};

export const updateZoeRecords = async (id, data) => {
  try {
    const item = await db.ZoeRecord.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.update(data);
  } catch (error) {
    console.log(error)
    throw new Error('Error updating record: ' + error.message);
  }
};

export const destroyZoeRecords = async (id) => {
  try {
    const item = await db.ZoeRecord.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.destroy();
  } catch (error) {
    console.log(error)
    throw new Error('Error deleting record: ' + error.message);
  }
};