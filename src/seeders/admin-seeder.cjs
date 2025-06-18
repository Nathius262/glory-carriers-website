'use strict';
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { exec } = require('child_process'); // Import child_process to run shell commands

dotenv.config();

const DEFAULT_PASSWORD = process.env.USER_ADMIN_PASSWORD;

// Helper to check if the roles table exists
const doesTableExist = async (queryInterface, tableName) => {
  // Check the dialect and perform different queries based on the DBMS
  const { dialect } = queryInterface.sequelize.options;

  if (dialect === 'postgres') {
    const tableExists = await queryInterface.sequelize.query(
      `SELECT to_regclass('${tableName}');`
    );
    return tableExists[0][0].to_regclass !== null;
  }

  if (dialect === 'mysql') {
    const tableExists = await queryInterface.sequelize.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = '${tableName}';`
    );
    return tableExists[0].length > 0;
  }

  if (dialect === 'sqlite'){
    const tableExists = await queryInterface.sequelize.query(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`
    );
    return tableExists[0].length > 0;
  }

  throw new Error('Unsupported database dialect');
};


// Function to run migrations
async function runMigrations() {
  return new Promise((resolve, reject) => {
    // Execute the shell command to run migrations
    exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration error: ${stderr}`);
        return reject(error);
      }
      console.log(`Migration output: ${stdout}`);
      resolve(stdout);
    });
  });
}

async function seedAdmin(queryInterface, Sequelize) {
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  
  try {
    // Check if the "roles" table exists
    
    // Insert roles if they don't exist
    await queryInterface.bulkInsert('roles', [
      { name: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'staff', createdAt: new Date(), updatedAt: new Date() },
      { name: 'user', createdAt: new Date(), updatedAt: new Date() }
    ], { ignoreDuplicates: true });

    // Fetch the roles from the database after insertion
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, name FROM "roles" WHERE name IN ('admin', 'staff', 'user')`
    );

    // Check if the admin user exists
    const existingAdminUser = await queryInterface.sequelize.query(
      `SELECT * FROM "users" WHERE "email" = '${process.env.USER_ADMIN_EMAIL}'`
    );

    if (existingAdminUser[0].length === 0) {
      // Insert admin user if it doesn't exist
      await queryInterface.bulkInsert('users', [{
        //name: process.env.USER_ADMIN_NAME,
        username: process.env.USER_ADMIN_USERNAME,
        email: process.env.USER_ADMIN_EMAIL,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

      // Get the newly created user
      const [adminUser] = await queryInterface.sequelize.query(
        `SELECT * FROM "users" WHERE "email" = '${process.env.USER_ADMIN_EMAIL}'`
      );

      // Associate the admin user with all roles in the user_roles table
      const userroles = roles.map(role => ({
        userId: adminUser[0].id,
        roleId: role.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await queryInterface.bulkInsert('user_roles', userroles, {});
      console.log('Admin user and roles successfully created.');
    } else {
      console.log('Admin user already exists. Skipping user creation.');
    }

  } catch (error) {
    console.error('Error while seeding admin user:', error);
  }
}

module.exports = {
  seedAdmin
};
