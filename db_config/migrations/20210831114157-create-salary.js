'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Salaries', {
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
      unofficial_net: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      unofficial_pay: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      gross: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unpaid_day_off: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      daily_payment: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      net: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Salaries');
  }
};