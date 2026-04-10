'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DepartmentRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DepartmentRole.belongsTo(models.Department, {
        foreignKey: 'department_id',
        as: 'department'
      });

      DepartmentRole.hasMany(models.DepartmentMember, {
        foreignKey: 'role_id',
        as: 'members'
      });
    }
  }
  DepartmentRole.init({
    name: DataTypes.STRING,
    level: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DepartmentRole',
    tableName: 'department_roles',
    underscored: true,
  });
  return DepartmentRole;
};