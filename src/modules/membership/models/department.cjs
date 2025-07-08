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
      Department.belongsToMany(models.Member, {
        through: 'member_departments'
      });
      Department.hasMany(models.LeadershipAssignment);
    };
  }
  Department.init({
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.TEXT,
    
  }, {
    sequelize,
    modelName: 'Department',
    tableName: 'departments'
  });
  return Department;
};