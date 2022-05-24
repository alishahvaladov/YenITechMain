'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      father_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sex: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      q_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      y_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      SSN: {
        type: Sequelize.STRING,
        allowNull: false
      },
      FIN: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      home_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      j_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      j_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      dayoff_days_total: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      department: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      working_days: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      position_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATEONLY
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Employees');
  }
};