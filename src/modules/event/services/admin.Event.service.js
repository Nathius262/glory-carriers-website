import db from '../../../models/index.cjs';
import { Op } from 'sequelize';

export const findAllActiveEvents = async ({
  limit,
  offset,
  order = null
}) => {
  try {
    const now = new Date();

    const defaultOrder = [
      ['start_date', 'ASC'],
      ['createdAt', 'DESC']
    ];

    const { rows: events, count: totalItems } =
      await db.Event.findAndCountAll({
        where: {
          [Op.or]: [
            // Upcoming events
            {
              start_date: {
                [Op.gte]: now
              }
            },

            // Live events with an end date
            {
              start_date: {
                [Op.lte]: now
              },
              end_date: {
                [Op.gte]: now
              }
            },

            // One-day events (no end date)
            {
              start_date: {
                [Op.gte]: new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate()
                ),
                [Op.lt]: new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate() + 1
                )
              },
              end_date: null
            }
          ]
        },
        limit,
        offset,
        distinct: true,
        order: order || defaultOrder
      });

    return {
      events,
      totalItems,
      totalPages: limit
        ? Math.ceil(totalItems / limit)
        : 1
    };

  } catch (error) {
    throw new Error(`Error fetching active events: ${error.message}`);
  }
};

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