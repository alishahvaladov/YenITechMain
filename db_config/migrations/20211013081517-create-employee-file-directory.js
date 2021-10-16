'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmployeeFileDirectories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      emp_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      insert_user: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      update_user: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      delete_user: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      uploaded_files: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EmployeeFileDirectories');
  }
};