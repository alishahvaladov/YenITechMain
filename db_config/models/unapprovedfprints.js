'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UnapprovedFPrints extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UnapprovedFPrints.init({
    name: {
      type: DataTypes.STRING
    },
    f_print_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    tabel_no: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'UnapprovedFPrints',
  });
  return UnapprovedFPrints;
};
