'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeShift extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeeShift.init({
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shift_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shift_start: {
      type: DataTypes.TIME,
      allowNull: true
    },
    shift_end: {
      type: DataTypes.TIME,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'EmployeeShift',
  });
  return EmployeeShift;
};