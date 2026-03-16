import db from '../models/index.cjs';


// Common transaction options
const defaultTransactionOptions = {
  retry: {
    max: 5,
    match: ['SQLITE_BUSY'],
    backoffBase: 1000,
    backoffExponent: 1.1
  }
};

// Helper function for transaction handling
export default async function withTransaction(fn, options = {}) {
  const transaction = await db.sequelize.transaction({
    ...defaultTransactionOptions,
    ...options
  });

  try {
    const result = await fn(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    console.error('Transaction error:', error);
    throw error;
  }
}
