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
    },
    {
      sequelize,
      modelName: "SalaryByMonth",
    }
  );
  return SalaryByMonth;
};
