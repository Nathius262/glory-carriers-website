'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class ProjectImage extends Model {

    static associate(models) {

      ProjectImage.belongsTo(models.Project, {
        foreignKey: 'project_id',
        as: 'project',
      });

    }

  }

  ProjectImage.init(
    {

      project_id: DataTypes.INTEGER,

      image_url: DataTypes.STRING,

      sort_order: DataTypes.INTEGER,

    },
    {
      sequelize,
      modelName: 'ProjectImage',
      tableName: 'project_images',
      underscored: true,
    }
  );

  return ProjectImage;
};