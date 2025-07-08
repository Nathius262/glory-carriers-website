'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    // Seed core roles
    await queryInterface.bulkInsert('leadership_roles', [
      // Pastoral Roles
      { title: 'Senior Pastor', level: 1, isPastoral: true, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Associate Pastor', level: 2, isPastoral: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Departmental Roles
      { title: 'HOD', level: 3, isDepartmental: true, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Assistant HOD', level: 4, isDepartmental: true, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Department Secretary', level: 5, isDepartmental: true, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Department Treasurer', level: 5, isDepartmental: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Fellowship Roles
      { title: 'Fellowship Head', level: 3, isDepartmental: true, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Fellowship Assistant', level: 4, isDepartmental: true, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('leadership_roles', null, {});
  }
};
