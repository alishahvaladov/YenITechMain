'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TimeOffRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TimeOffRequest.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timeoff_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timeoff_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    timeoff_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    timeoff_job_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    emr_no: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      default: 0,
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'TimeOffRequest',
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return TimeOffRequest;
};