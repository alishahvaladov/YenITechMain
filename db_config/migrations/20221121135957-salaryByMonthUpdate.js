"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.addColumn("SalaryByMonths", "workDaysCount", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "dailySalary", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "gross", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "dailySalaryTimeOff", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "monthTimeOffSalary", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "overLimitPhoneBill", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "gymBill", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "aliment", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "creditOrMortgage", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "lateFine", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "otherFines", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "tabelNo", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "income_tax", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "emp_pension_fund", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "dsmf", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "unemployment", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "healthIssurance", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "companyDSMF", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "companyUnemployment", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "companyHealthIssurance", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "totalTaxAndFine", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "totalCompanyTaxes", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("SalaryByMonths", "nett", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("SalaryByMonths", "workDaysCount", {
      type: Sequelize.INTEGER,
    }),
      await queryInterface.removeColumn("SalaryByMonths", "dailySalary", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "gross", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "dailySalaryTimeOff", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "monthTimeOffSalary", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "overLimitPhoneBill", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "gymBill", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "aliment", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "creditOrMortgage", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "lateFine", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "otherFines", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "tabelNo", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "income_tax", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "emp_pension_fund", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "dsmf", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "unemployment", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "healthIssurance", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "companyDSMF", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "companyUnemployment", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "companyHealthIssurance", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "totalTaxAndFine", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "totalCompanyTaxes", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.removeColumn("SalaryByMonths", "nett", {
        type: Sequelize.INTEGER,
      });
  },
};
