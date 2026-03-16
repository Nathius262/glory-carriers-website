'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PasswordReset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PasswordReset.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  PasswordReset.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    otp: { type: DataTypes.STRING, allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    used: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    sequelize,
    modelName: 'PasswordReset',
    tableName: 'password_rests',
    underscored: true
  });
  return PasswordReset;
};