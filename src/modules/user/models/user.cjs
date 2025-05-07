'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Role, {
        through: 'user_roles',  // Junction table
        foreignKey: 'userId',
        as: 'roles'
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      unique:true,
      allowNull:false
    },
    email: {
      type: DataTypes.STRING,
      unique:true,
      allowNull:false
    },
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};