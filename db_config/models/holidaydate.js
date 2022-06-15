'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HolidayDate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HolidayDate.init({
    holiday_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    holiday_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'HolidayDate',
  });
  return HolidayDate;
};