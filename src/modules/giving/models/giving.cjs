'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidv4 } = require('uuid'); 
module.exports = (sequelize, DataTypes) => {
  class Giving extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Giving.init({
    id: {
      unique:true,
      allowNull:false,
      primaryKey:true,
      type: DataTypes.STRING(16),
      defaultValue: () => uuidv4().replace(/-/g, '').substring(0, 16),
    },
    reference: {
      unique:true,
      allowNull:false,
      type: DataTypes.STRING
    },
    paystack_reference:{
      type: DataTypes.STRING,
      unique:true
    },
    email:{
      type:DataTypes.STRING,
      //unique:true,
      allowNull:false
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    phone:{
      type:DataTypes.STRING
    },
    amount:{
      type: DataTypes.DECIMAL
    },
    status:{
      type:DataTypes.STRING
    },
    payment_channel:{
      type:DataTypes.STRING
    },
    currency:{
      type:DataTypes.STRING
    },
    payment_type:{
      type:DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Giving',
    tableName: 'givings'
  });
  return Giving;
};