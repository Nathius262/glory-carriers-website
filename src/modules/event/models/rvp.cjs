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
    gender: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Rvp',
    tableName: 'event_rvps'
  });
  return Rvp;
};