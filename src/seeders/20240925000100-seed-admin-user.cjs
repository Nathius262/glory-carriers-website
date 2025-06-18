'use strict';
const adminSeeder = require('./admin-seeder.cjs'); // Import the reusable seeder

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await adminSeeder.seedAdmin(queryInterface, Sequelize);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the user-role associations
    await queryInterface.bulkDelete('uer_role', {
      userId: {
        [Sequelize.Op.eq]: (await queryInterface.sequelize.query(
          `SELECT id FROM "users" WHERE "email" = '${process.env.USER_ADMIN_EMAIL}'`
        ))[0][0].id // Fetch the user ID based on the email
      }
    }, {});

    // Remove the admin user
    await queryInterface.bulkDelete('users', {
      email: process.env.USER_ADMIN_EMAIL // Ensures only the admin user created here is deleted
    }, {});

    // Remove the roles
    await queryInterface.bulkDelete('roles', {
      role_name: { [Sequelize.Op.in]: ['admin', 'staff', 'user'] }
    }, {});
  }
};


