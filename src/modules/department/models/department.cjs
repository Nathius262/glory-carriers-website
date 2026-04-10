'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    };
  }
  Department.init({
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    department_briefing: DataTypes.TEXT,
    image_url: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'Department',
    tableName: 'departments',
    underscored: true,
  });
  return Department;
};