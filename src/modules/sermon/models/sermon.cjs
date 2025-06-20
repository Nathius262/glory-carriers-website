'use strict';
const {
  Model
} = require('sequelize');
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
    name: DataTypes.STRING,
    audio_url: DataTypes.STRING,
    video_url: DataTypes.STRING,
    image_url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Sermon',
    tableName: 'sermons',
  });
  return Sermon;
};