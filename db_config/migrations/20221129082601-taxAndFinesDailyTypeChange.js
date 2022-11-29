"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("TaxAndFines", "dailySalaryTimeOff", {
      type: Sequelize.JSON,
    });
    await queryInterface.addColumn("TaxAndFines", "emp_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("TaxAndFines", "dailySalaryTimeOff", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.removeColumn("TaxAndFines", "emp_id");
  },
};
