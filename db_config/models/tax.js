"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tax extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tax.init(
    {
      sbm_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tax_date: {
        type: DataTypes.DATE,
      },
      salary: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      income_tax: {
        type: DataTypes.INTEGER,
      },
      emp_pension_fund: {
        type: DataTypes.INTEGER,
      },
      emp_unemployment_insurance: {
        type: DataTypes.INTEGER,
      },
      emp_medical_insurance: {
        type: DataTypes.INTEGER,
      },
      totalTax: {
        type: DataTypes.INTEGER,
      },
      nett: {
        type: DataTypes.INTEGER,
      },
      pension_fund: {
        type: DataTypes.INTEGER,
      },
      unemployment_insurance: {
        type: DataTypes.INTEGER,
      },
      medical_insurance: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Tax",
    }
  );
  return Tax;
};
