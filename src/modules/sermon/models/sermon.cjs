'use strict';
const path = require('path');
const fs = require('fs');

const {
  Model
} = require('sequelize');

const slugPath = path.join(__dirname, 'src', '../../../../utils/generate_slug.cjs');
if(!fs.existsSync(slugPath)){
  throw new Error (`Missing required odule at: ${slugPath}`);
};
const generateUniqueSlug = require(slugPath);

module.exports = (sequelize, DataTypes) => {
  class Sermon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Sermon.init({
    title: DataTypes.STRING,
    audio_url: DataTypes.STRING,
    video_url: DataTypes.STRING,
    image_url: DataTypes.STRING,
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Sermon',
    tableName: 'sermons',
  });

  // Use generateUniqueSlug from the helper file in hooks
  Sermon.beforeValidate(async (sermon) => {
    if (!sermon.slug) {
      sermon.slug = await generateUniqueSlug(sermon.title, Sermon);
    }
  });

  Sermon.beforeUpdate(async (sermon) => {
    if (sermon.changed('title')) {
      sermon.slug = await generateUniqueSlug(sermon.title, Sermon);
    }
  });

  return Sermon;
};