'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class leadership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  leadership.init({
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    level: {
      type: DataTypes.INTEGER,
      comment: 'Hierarchy level (1=highest)'
    },
    is_departmental: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Requires department assignment'
    },
    is_pastoral: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'leadership',
  });
  return leadership;
};