import db from '../../../models/index.cjs';



export const findAll = async () => {
  try {
    return await Sermon.findAll();
  } catch (error) {
    throw new Error('Error fetching records: ' + error.message);
  }
};

export const findById = async (id) => {
  try {
    const item = await Sermon.findByPk(id);
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
    throw new Error('Error fetching record: ' + error.message);
  }
};