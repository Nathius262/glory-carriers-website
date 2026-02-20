import db from '../../../models/index.cjs';

export const create = async (data) => {
  try {
    return await db.Mentorship.create(data);
  } catch (error) {
    console.log(error)
    throw new Error('Error creating record: ' + error.message);
  }
};
