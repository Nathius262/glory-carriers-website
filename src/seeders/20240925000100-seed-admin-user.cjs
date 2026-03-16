'use strict';
const bcrypt = require('bcryptjs');
require('dotenv').config();
const DEFAULT_PASSWORD = process.env.USER_ADMIN_PASSWORD;

// Helper: Check if a table exists based on dialect
async function doesTableExist(queryInterface, tableName) {
  const { dialect } = queryInterface.sequelize.options;

  if (dialect === 'postgres') {
    const result = await queryInterface.sequelize.query(
      `SELECT to_regclass('${tableName}');`
    );
    return result[0][0].to_regclass !== null;
  }

  if (dialect === 'mysql') {
    const result = await queryInterface.sequelize.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = '${tableName}';`
    );
    return result[0].length > 0;
  }

  if (dialect === 'sqlite') {
    const result = await queryInterface.sequelize.query(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`
    );
    return result[0].length > 0;
  }

  throw new Error('Unsupported database dialect');
}

async function seedAdmin(queryInterface, Sequelize) {
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  try {
    // Ensure roles table exists
    if (!(await doesTableExist(queryInterface, 'roles'))) {
      throw new Error('Roles table does not exist!');
    }

    // Insert roles if they don't already exist
    const [existingRoles] = await queryInterface.sequelize.query(
      `SELECT name FROM roles WHERE name IN ('admin','staff','user');`
    );
    const existingRoleNames = existingRoles.map(r => r.name);

    const rolesToInsert = ['admin', 'staff', 'user']
      .filter(name => !existingRoleNames.includes(name))
      .map(name => ({ name, created_at: new Date(), updated_at: new Date() }));

    if (rolesToInsert.length > 0) {
      await queryInterface.bulkInsert('roles', rolesToInsert);
    }

    // Fetch all relevant roles after insertion
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name IN ('admin','staff','user');`
    );

    // Ensure users table exists
    if (!(await doesTableExist(queryInterface, 'users'))) {
      throw new Error('Users table does not exist!');
    }

    // Check if admin user exists
    const [existingAdmin] = await queryInterface.sequelize.query(
      `SELECT * FROM users WHERE email='${process.env.USER_ADMIN_EMAIL}'`
    );

    if (existingAdmin.length === 0) {
      // Insert admin user
      await queryInterface.bulkInsert('users', [
        {
          username: process.env.USER_ADMIN_USERNAME,
          email: process.env.USER_ADMIN_EMAIL,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      const [adminUser] = await queryInterface.sequelize.query(
        `SELECT * FROM users WHERE email='${process.env.USER_ADMIN_EMAIL}'`
      );

      // Associate admin with all roles
      const userRoles = roles.map(role => ({
        user_id: adminUser[0].id,
        role_id: role.id,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      await queryInterface.bulkInsert('user_roles', userRoles);
      console.log('Admin user and roles created successfully.');
    } else {
      console.log('Admin user already exists. Skipping creation.');
    }
  } catch (err) {
    console.error('Error seeding admin:', err);
    throw err;
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await seedAdmin(queryInterface, Sequelize);
  },

  down: async (queryInterface, Sequelize) => {
    // Get admin user's ID
    const [adminUsers] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email='${process.env.USER_ADMIN_EMAIL}'`
    );

    if (adminUsers.length > 0) {
      const adminUserId = adminUsers[0].id;

      // Delete only user_roles associated with this admin
      await queryInterface.bulkDelete('user_roles', {
        user_id: adminUserId,
        role_id: {
          [Sequelize.Op.in]: Sequelize.literal(
            `(SELECT id FROM roles WHERE name IN ('admin','staff','user'))`
          ),
        },
      });
    }

    // Delete admin user
    await queryInterface.bulkDelete('users', {
      email: process.env.USER_ADMIN_EMAIL,
    });

    // Delete roles only if they are not attached to any other user
    const [roles] = await queryInterface.sequelize.query(
      `SELECT r.id, r.name
       FROM roles r
       LEFT JOIN user_roles ur ON r.id = ur.role_id
       WHERE r.name IN ('admin','staff','user')
       GROUP BY r.id, r.name
       HAVING COUNT(ur.user_id) = 0;`
    );

    if (roles.length > 0) {
      await queryInterface.bulkDelete('roles', {
        id: {
          [Sequelize.Op.in]: roles.map(r => r.id),
        },
      });
    }
  },
};
