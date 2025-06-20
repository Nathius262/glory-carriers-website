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

export const create = async (data) => {
  try {
    return await db.ZoeRecord.create(data);
  } catch (error) {
    throw new Error('Error creating record: ' + error.message);
  }
};

export const update = async (id, data) => {

  const {
    title,
    audio_url,
    image_url,
    video_url
  } = data;
  try {
    const item = await db.ZoeRecord.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.update({ title, audio_url, image_url, video_url });
  } catch (error) {
    throw new Error('Error updating record: ' + error.message);
  }
};

export const destroy = async (id) => {
  try {
    const item = await db.ZoeRecord.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.destroy();
  } catch (error) {
    throw new Error('Error deleting record: ' + error.message);
  }
};