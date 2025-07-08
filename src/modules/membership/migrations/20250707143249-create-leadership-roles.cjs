'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leadership_roles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: { type: Sequelize.STRING, allowNull: false, unique: true },
      level: {
        type: Sequelize.INTEGER,
        comment: 'Hierarchy level (1=highest)'
      },
      is_departmental: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Requires department assignment'
      },
      is_pastoral: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    
  },
  async down(queryInterface) {
    await queryInterface.dropTable('leadership_roles');
  }
};