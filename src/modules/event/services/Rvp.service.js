import db from '../../../models/index.cjs';



export const findAll = async ({limit, offset}) => {
  try {
    const {rows: rvps, count: totalItems } = await db.Rvp.findAndCountAll({
      limit,
      offset,
      distinct:true,
      order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
    })
    return {
      rvps,
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
    const item = await db.Rvp.findByPk(id);
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
   console.log(error)
    throw new Error('Error fetching record: ' + error.message);
  }
};

export const create_rvp = async (data) => {
  try {

    //vaildate email uniqueness
    const existingRvp = await db.Rvp.findOne({ where: { email: data.email } });
    if (existingRvp) {
      throw new Error('An RSVP with this email already exists.');
    }

    return await db.Rvp.create(data);
  } catch (error) {
    throw new Error('Error creating record: ' + error.message);
  }
};