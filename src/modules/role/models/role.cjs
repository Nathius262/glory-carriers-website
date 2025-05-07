'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.belongsToMany(models.User, {
        through: 'user_role',  // Junction table
        foreignKey: 'roleId',
        as: 'users'
      });
    }
  }
  Role.init({
    role_name: {
      type: DataTypes.STRING,
      unique:true,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles'
  });
  return Role;
};