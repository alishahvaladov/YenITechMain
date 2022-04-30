'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FPrintDraft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FPrintDraft.init({
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    emp_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    f_print_date: {
      allowNull: false,
      type: DataTypes.DATEONLY
    },
    f_print_time: {
      allowNull: false,
      type: DataTypes.TIME
    },
  }, {
    sequelize,
    modelName: 'FPrintDraft',
  });
  return FPrintDraft;
};