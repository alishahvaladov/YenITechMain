'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FPrint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FPrint.init({
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    f_enter: {
      type: DataTypes.DATE
    },
    f_leave: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'FPrint',
  });
  return FPrint;
};