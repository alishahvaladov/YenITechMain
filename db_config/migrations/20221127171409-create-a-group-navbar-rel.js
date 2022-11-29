'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AGroupNavbarRels', {
      nav_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      agroup_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AGroupNavbarRels');
  }
};