import db from '../../../models/index.cjs';

export const findAll = async ({
  limit,
  offset,
  order = null
}) => {
  try {

    const defaultOrder = [
      ['createdAt', 'DESC'],
      ['updatedAt', 'DESC']
    ];

    const { rows: events, count: totalItems } =
      await db.Event.findAndCountAll({
        limit,
        offset,
        distinct: true,
        order: order || defaultOrder
      });

    return {
      events,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    };

  } catch (error) {
    throw new Error('Error fetching records: ' + error.message);
  }
};

export const findById = async (id) => {
  try {
    const item = await db.Event.findByPk(id);
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
    throw new Error('Error fetching record: ' + error.message);
  }
};

export const create = async (data) => {
  try {
    const event = await db.Event.create(data);
    return event;
  } catch (error) {
    throw new Error(`Event creation failed: ${error.message}`);
  }
};

export const update = async (id, data) => {
  try {
    const item = await db.Event.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.update(data);
  } catch (error) {
    throw new Error('Error updating record: ' + error.message);
  }
};

export const destroy = async (id) => {
  try {
    const item = await db.Event.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.destroy();
  } catch (error) {
    throw new Error('Error deleting record: ' + error.message);
  }
};


//RVPS
export const findAllRvps = async ({ limit, offset }) => {
  try {
    const { rows: rvps, count: totalItems } = await db.Rvp.findAndCountAll({
      limit,
      offset,
      distinct: true,
      order: [['createdAt', 'DESC']]
    });
    return {
      rvps,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  } catch (error) {
    throw new Error('Error fetching RSVP records: ' + error.message);
  }
}