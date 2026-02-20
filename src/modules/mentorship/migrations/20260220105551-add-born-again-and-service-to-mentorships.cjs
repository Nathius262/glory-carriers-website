'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('mentorships', 'born_again_date', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    await queryInterface.addColumn('mentorships', 'born_again_place', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('mentorships', 'service_history', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('mentorships', 'born_again_date');
    await queryInterface.removeColumn('mentorships', 'born_again_place');
    await queryInterface.removeColumn('mentorships', 'service_history');
  }
};