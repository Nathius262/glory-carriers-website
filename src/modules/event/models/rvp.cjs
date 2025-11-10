'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rvp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Rvp.init({
    name: {
      type: DataTypes.STRING
    },
    email:{
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.TEXT
    },
    state: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.STRING
    },
    attendance_mode: {
      type: DataTypes.STRING,
      defaultValue: "on_site",
      allowNull:true
    },
  }, {
    sequelize,
    modelName: 'Rvp',
    tableName: 'event_rvps'
  });
  return Rvp;
};