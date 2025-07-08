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
      description: Sequelize.TEXT,
      is_fellowship: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this is a fellowship group'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('departments');
  }
};