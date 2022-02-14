'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ForgottenFPrints extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ForgottenFPrints.init({
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    f_print_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    f_print_time_entrance: {
      type: DataTypes.TIME,
      allowNull: true
    },
    f_print_time_exit: {
      type: DataTypes.TIME,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'ForgottenFPrints',
  });
  return ForgottenFPrints;
};