'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DepartmentMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DepartmentMember.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      DepartmentMember.belongsTo(models.Department, {
        foreignKey: 'department_id',
        as: 'department'
      });

      DepartmentMember.belongsTo(models.DepartmentRole, {
        foreignKey: 'role_id',
        as: 'role'
      });
    }
  }
  DepartmentMember.init({
    joined_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'DepartmentMember',
    tableName: 'department_members',
    underscored: false,
  });
  return DepartmentMember;
};