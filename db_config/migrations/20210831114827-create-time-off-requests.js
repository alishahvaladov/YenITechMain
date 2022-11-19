'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TimeOffRequests', {
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
      emp_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      timeoff_type: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      timeoff_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      timeoff_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      timeoff_job_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      timeoff_time: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      timeoff_time_start: {
        type: Sequelize.TIME,
        allowNull: true
      },
      timeoff_time_end: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      timeoff_time_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      timeoff_percent: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      emr_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        default: 0,
        allowNull: false,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TimeOffRequests');
  }
};