"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TaxAndFines", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      workDaysCount: {
        type: Sequelize.INTEGER,
      },
      dailySalary: {
        type: Sequelize.INTEGER,
      },
      gross: {
        type: Sequelize.INTEGER,
      },
      dailySalaryTimeOff: {
        type: Sequelize.INTEGER,
      },
      monthTimeOffSalary: {
        type: Sequelize.INTEGER,
      },
      overLimitPhoneBill: {
        type: Sequelize.INTEGER,
      },
      gymBill: {
        type: Sequelize.INTEGER,
      },
      aliment: {
        type: Sequelize.INTEGER,
      },
      creditOrMortgage: {
        type: Sequelize.INTEGER,
      },
      lateFine: {
        type: Sequelize.INTEGER,
      },
      otherFines: {
        type: Sequelize.INTEGER,
      },
      tabelNo: {
        type: Sequelize.INTEGER,
      },
      income_tax: {
        type: Sequelize.INTEGER,
      },
      dsmf: {
        type: Sequelize.INTEGER,
      },
      unemployment: {
        type: Sequelize.INTEGER,
      },
      healthIssurance: {
        type: Sequelize.INTEGER,
      },
      companyDSMF: {
        type: Sequelize.INTEGER,
      },
      companyUnemployment: {
        type: Sequelize.INTEGER,
      },
      companyHealthIssurance: {
        type: Sequelize.INTEGER,
      },
      totalTaxAndFine: {
        type: Sequelize.INTEGER,
      },
      totalCompanyTaxes: {
        type: Sequelize.INTEGER,
      },
      nett: {
        type: Sequelize.INTEGER,
      },
      salaryMonth: {
        type: Sequelize.DATEONLY,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TaxAndFines");
  },
};
