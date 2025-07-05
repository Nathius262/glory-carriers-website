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
      await queryInterface.addColumn('givings', 'payment_channel', {type: Sequelize.DataTypes.STRING, defaultValue: ''}, { transaction });
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
      await queryInterface.removeColumn('givings', 'payment_channel', { transaction });
      await transaction.commit();
      
    } catch (error) {
      await transaction.rollback();
      throw err;
    }
  }
};
