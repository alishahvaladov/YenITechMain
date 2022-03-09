'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CalculatedFineData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CalculatedFineData.init({
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    f_print_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    f_print_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    calculatedMinute: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'CalculatedFineData',
  });
  return CalculatedFineData;
};