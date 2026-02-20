'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mentorship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mentorship.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    email: {
      type: DataTypes.STRING
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    born_again_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    born_again_place: {
      type: DataTypes.STRING,
      allowNull: true
    },
    service_history: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Mentorship',
    tableName: 'mentorships',
    underscored: true,
  });
  return Mentorship;
};