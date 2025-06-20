'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ZoeRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ZoeRecord.init({
    title: DataTypes.STRING,
    audio_url: DataTypes.STRING,
    video_url: DataTypes.STRING,
    image_url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ZoeRecord',
    tableName: 'zoe_records'
  });
  return ZoeRecord;
};