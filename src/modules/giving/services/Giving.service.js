import db from '../../../models/index.cjs';



export const findAll = async ({limit, offset}) => {
  try {
    const {rows: givings, count: totalItems } = await db.Giving.findAndCountAll({
      limit,
      offset,
      distinct:true,
      order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
    })
    return {
      givings,
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
    const item = await db.Giving.findByPk(id);
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
   console.log(error)
    throw new Error('Error fetching record: ' + error.message);
  }
};


export const create = async (data) => {
  const transaction = await db.sequelize.transaction();

  try {
    const new_data = await db.Giving.create(data, {transaction});
    await transaction.commit()
    return new_data;
  } catch (error) {
    await transaction.rollback();
    console.log('main error', error);
    console.log('other error', error.errors);
    // Check if it's a validation error
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      // Extract all error messages
      const errorMessages = error.errors.map(err => err.message);
      
      // Combine into one string
      const combinedError = errorMessages.join('. '); // Join with period+space
      
      // Throw the combined error
      throw new Error(combinedError);
    }
    
    // For non-validation errors, just throw as-is
    throw error;
  }
}