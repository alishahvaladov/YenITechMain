"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SalaryByMonth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SalaryByMonth.init(
    {
      emp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      salary_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      salary_cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      workDaysCount: {
        type: DataTypes.INTEGER,
      },
      dailySalary: {
        type: DataTypes.INTEGER,
      },
      gross: {
        type: DataTypes.INTEGER,
      },
      dailySalaryTimeOff: {
        type: DataTypes.INTEGER,
      },
      monthTimeOffSalary: {
        type: DataTypes.INTEGER,
      },
      overLimitPhoneBill: {
        type: DataTypes.INTEGER,
      },
      gymBill: {
        type: DataTypes.INTEGER,
      },
      aliment: {
        type: DataTypes.INTEGER,
      },
      creditOrMortgage: {
        type: DataTypes.INTEGER,
      },
      lateFine: {
        type: DataTypes.INTEGER,
      },
      otherFines: {
        type: DataTypes.INTEGER,
      },
      tabelNo: {
        type: DataTypes.INTEGER,
      },
      income_tax: {
        type: DataTypes.INTEGER,
      },
      emp_pension_fund: {
        type: DataTypes.INTEGER,
      },
      dsmf: {
        type: DataTypes.INTEGER,
      },
      unemployment: {
        type: DataTypes.INTEGER,
      },
      healthIssurance: {
        type: DataTypes.INTEGER,
      },
      companyDSMF: {
        type: DataTypes.INTEGER,
      },
      companyUnemployment: {
        type: DataTypes.INTEGER,
      },
      companyHealthIssurance: {
        type: DataTypes.INTEGER,
      },
      totalTaxAndFine: {
        type: DataTypes.INTEGER,
      },
      totalCompanyTaxes: {
        type: DataTypes.INTEGER,
      },
      nett: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "SalaryByMonth",
    }
  );
  return SalaryByMonth;
};
