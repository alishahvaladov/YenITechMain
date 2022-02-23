'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApprovedFinesByDate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ApprovedFinesByDate.init({
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    approved_fine_minute: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approved_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fined_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ApprovedFinesByDate',
  });
  return ApprovedFinesByDate;
};