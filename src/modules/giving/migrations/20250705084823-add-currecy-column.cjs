'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('givings', 'currency', {type: Sequelize.DataTypes.STRING, defaultValue: 'NGN'}, { transaction });
      await transaction.commit();
      
    } catch (error) {
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('givings', 'currency', { transaction });
      await transaction.commit();
      
    } catch (error) {
      await transaction.rollback();
      throw err;
    }
  }
};
