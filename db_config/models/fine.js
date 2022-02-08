'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Fine.init({
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    minute_total: {
      type: DataTypes.INTEGER,
      default: 0
    },
    fine_minute: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0
    },
    fine_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0
    },
  }, {
    sequelize,
    modelName: 'Fine',
  });
  return Fine;
};