'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TimeOffDaysByYear extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TimeOffDaysByYear.init({
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    emp_timeoff_start_date: {
      type:DataTypes.DATEONLY,
      allowNull: false
    },
    emp_timeoff_end_date: {
      type:DataTypes.DATEONLY,
      allowNull: false
    },
    time_off_days: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'TimeOffDaysByYear',
  });
  return TimeOffDaysByYear;
};