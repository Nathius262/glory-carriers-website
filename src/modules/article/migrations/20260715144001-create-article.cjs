'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false
      },

      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      summary: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      content: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      },

      image_url: {
        type: Sequelize.STRING,
        allowNull: true
      },

      author: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Glory Carriers Ministry Int\'l'
      },

      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      is_published: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      published_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('articles', ['slug']);
    await queryInterface.addIndex('articles', ['is_published']);
    await queryInterface.addIndex('articles', ['is_featured']);
    await queryInterface.addIndex('articles', ['published_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('articles');
  }
};