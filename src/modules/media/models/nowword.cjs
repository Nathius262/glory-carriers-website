'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class nowword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  nowword.init({
    title: DataTypes.STRING,
    file_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'nowword',
  });
  return nowword;
};