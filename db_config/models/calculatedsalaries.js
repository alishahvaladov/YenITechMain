'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CalculatedSalaries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CalculatedSalaries.init({
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    salary_calculated_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    salary_calculated_cost: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'CalculatedSalaries',
  });
  return CalculatedSalaries;
};