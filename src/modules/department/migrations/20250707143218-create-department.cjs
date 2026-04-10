'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('departments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      image_url: { type: Sequelize.STRING, allowNull: true },
      department_briefing: Sequelize.TEXT,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('departments');
  }
};