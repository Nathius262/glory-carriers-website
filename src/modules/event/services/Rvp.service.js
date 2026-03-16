import db from '../../../models/index.cjs';
import { sendEmail, kabodRsvpSuccessTemplate } from '../../../utils/email.js';


export const findAll = async ({ limit, offset }) => {
  try {
    const { rows: rvps, count: totalItems } = await db.Rvp.findAndCountAll({
      limit,
      offset,
      distinct: true,
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
  let transaction;

  try {
    // Start transaction
    transaction = await db.sequelize.transaction();

    // Validate email uniqueness inside transaction
    const existingRvp = await db.Rvp.findOne({
      where: { email: data.email },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (existingRvp) {
      throw new Error('An RSVP with this email already exists.');
    }

    //  Create RSVP record
    const new_data = await db.Rvp.create(data, { transaction });

    // Commit database changes first
    await transaction.commit();

    // Attempt to send email after DB commit (non-blocking)
    const emailResult = await sendEmail({
      to: new_data.email,
      subject: "✅ Your RSVP for KABOD’25 is Confirmed!",
      html: kabodRsvpSuccessTemplate(new_data.name),
    });

    if (emailResult?.error) {
      console.warn("⚠️ Email not sent but RSVP succeeded:", emailResult.message);
    }

    return new_data;

  } catch (error) {
    // Rollback only if transaction is active
    if (transaction) await transaction.rollback();
    throw new Error('Error creating record: ' + error.message);
  } finally {
    if (transaction && !transaction.finished) {
      await transaction.rollback().catch(() => { });
    }
  }
};