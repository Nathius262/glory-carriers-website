'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Event.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },
      image_url: {
        type: DataTypes.STRING
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull:false
      },
      end_date: {
        type: DataTypes.DATE
      },
      is_recurring:{
        type:DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_headline:{
        type:DataTypes.BOOLEAN,
        defaultValue: false
      }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'events'
  });
  return Event;
};