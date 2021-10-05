'use strict';
const {
  Model, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DepartmentPosition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DepartmentPosition.init({
    dep_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pos_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    proj_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'DepartmentPosition',
    paranoid: true
  });
  return DepartmentPosition;
};