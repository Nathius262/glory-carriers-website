'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    //add gender, date_of_birth, occupation, address to profile table
    await queryInterface.addColumn('profiles', 'gender', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('profiles', 'date_of_birth', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('profiles', 'occupation', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('profiles', 'address', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('profiles', 'gender');
    await queryInterface.removeColumn('profiles', 'date_of_birth');
    await queryInterface.removeColumn('profiles', 'occupation');
    await queryInterface.removeColumn('profiles', 'address');
  }
};
