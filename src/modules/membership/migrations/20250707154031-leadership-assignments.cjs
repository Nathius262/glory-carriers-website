'use strict';

/** @type {import('sequelize-cli').Migration} */
// Migration: create-leadership-assignments.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leadership_assignments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      member_id: {
        type: Sequelize.INTEGER,
        references: { model: 'members', key: 'id' },
        allowNull: false
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: { model: 'leadership_roles', key: 'id' },
        allowNull: false
      },
      department_id: {
        type: Sequelize.INTEGER,
        references: { model: 'departments', key: 'id' },
        comment: 'Required for departmental roles'
      },
      start_date: { type: Sequelize.DATEONLY, defaultValue: Sequelize.NOW },
      end_date: Sequelize.DATEONLY,
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    // Add constraint for single active HOD per department
    await queryInterface.addConstraint('leadership_assignments', {
      fields: ['department_id', 'role_id', 'is_active'],
      type: 'unique',
      name: 'unique_active_department_role',
      where: {
        is_active: true,
        department_id: { [Sequelize.Op.not]: null }
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('leadership_assignments');
  }
};