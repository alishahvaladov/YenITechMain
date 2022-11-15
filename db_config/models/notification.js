'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
    header: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false
    },
    belongs_to: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    belongs_to_role: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    seen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    importance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};