'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('project_images', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: 'projects',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      image_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

    });

  },

  async down(queryInterface) {
    await queryInterface.dropTable('project_images');
  },
};