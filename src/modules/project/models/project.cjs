'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.hasMany(models.ProjectImage, {
        foreignKey: 'project_id',
        as: 'images',
        onDelete: 'CASCADE',
      });
    }
  }

  Project.init(
    {
      title: DataTypes.STRING,

      slug: DataTypes.STRING,

      description: DataTypes.TEXT('long'),

      goal_amount: DataTypes.DECIMAL(15, 2),

      location: DataTypes.STRING,

      start_date: DataTypes.DATEONLY,

      end_date: DataTypes.DATEONLY,

      is_featured: DataTypes.BOOLEAN,

      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Project',
      tableName: 'projects',
      underscored: true,
    }
  );

  return Project;
};