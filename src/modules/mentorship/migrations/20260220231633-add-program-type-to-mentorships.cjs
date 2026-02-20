'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.addColumn(
        'mentorships',
        'program_type',
        {
          type: Sequelize.ENUM('FATHERHOOD', 'MENTORSHIP', 'DISCIPLESHIP'),
          allowNull: false,
          defaultValue: 'MENTORSHIP'
        },
        { transaction }
      );

    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.removeColumn(
        'mentorships',
        'program_type',
        { transaction }
      );

      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_mentorships_program_type";',
        { transaction }
      );

    });
  }
};