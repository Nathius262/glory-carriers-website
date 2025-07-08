'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Member.belongsTo(models.User);
      Member.belongsToMany(models.Department, {
        through: 'member_department'
      });
      Member.belongsToMany(models.LeadershipRole, {
        through: 'leadership_assignments',
        as: 'leadership_roles'
      });
    }
  }
  Member.init({
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
        unique: true,
        allowNull: false
      },
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
      profile_image: {
        type: DataTypes.STRING,
        defaultValue: 'assets/img/default-profile.jpg'
      },
      join_date: { type: DataTypes.DATEONLY, allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    sequelize,
    modelName: 'Member',
    tableName: 'members'
  });
  return Member;
};