'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TimeOffDaysByYears', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      emp_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      emp_timeoff_start_date: {
        type:Sequelize.DATEONLY,
        allowNull: false
      },
      emp_timeoff_end_date: {
        type:Sequelize.DATEONLY,
        allowNull: false
      },
      time_off_days: {
        type: Sequelize.INTEGER,
        allowNull: false
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TimeOffDaysByYears');
  }
};