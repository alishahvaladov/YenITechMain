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
    f_print_date_entrance: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    f_print_date_exit: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    f_print_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ForgottenFPrints',
  });
  return ForgottenFPrints;
};