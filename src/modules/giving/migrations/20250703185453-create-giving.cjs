'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid'); 
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('givings', {
      id: {
        allowNull: false,
        //autoIncrement: true,
        defaultValue: () => uuidv4().replace(/-/g, '').substring(0, 16),
        primaryKey: true,
        unique:true,
        type: Sequelize.STRING(16)
      },
      reference: {
        unique:true,
        allowNull:false,
        type: Sequelize.STRING
      },
      paystack_reference:{
        type: Sequelize.STRING,
        unique:true
      },
      email:{
        type:Sequelize.STRING,
        //unique:true,
        allowNull:false
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      phone:{
        type:Sequelize.STRING
      },
      amount:{
        type: Sequelize.DECIMAL
      },
      payment_type:{
        type:Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('givings');
  }
};