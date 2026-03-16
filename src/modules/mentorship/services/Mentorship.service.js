import db from '../../../models/index.cjs';

export const create = async (data) => {
  try {
    //valdiate data to prevent dupicate records with email, phone number or any other unique field if necessary
    const existingRecord = await db.Mentorship.findOne({
      where: {
        email: data.email
      }
    });

    if (existingRecord) {
      throw new Error('A record with this email or phone number already exists.');
    }


    return await db.Mentorship.create(data);
  } catch (error) {
    console.log(error)
    throw new Error('Error creating record: ' + error.message);
  }
};
