'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Salary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Salary.init({
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    gross: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unofficial_net: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Salary',
  });
  return Salary;
};