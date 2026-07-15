'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Article extends Model {

    static associate(models) {
    }

  }

  Article.init({

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    summary: {
      type: DataTypes.TEXT
    },

    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },

    image_url: {
      type: DataTypes.STRING
    },

    author: {
      type: DataTypes.STRING,
      defaultValue: "Glory Carriers Ministry Int'l"
    },

    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    published_at: {
      type: DataTypes.DATE
    }

  }, {

    sequelize,
    modelName: 'Article',
    tableName: 'articles',
    underscored: true,

  });

  return Article;

};