'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid'); 
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('members', {
      id: {
        allowNull: false,
        //autoIncrement: true,
        defaultValue: () => uuidv4().replace(/-/g, '').substring(0, 16),
        primaryKey: true,
        unique:true,
        type: Sequelize.STRING(16)
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        unique: true,
        allowNull: false
      },
      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      date_of_birth: { type: Sequelize.DATEONLY, allowNull: false },
      profile_image: {
        type: Sequelize.STRING,
        defaultValue: 'assets/img/default-profile.jpg'
      },
      join_date: { type: Sequelize.DATEONLY, allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('members');
  }
};