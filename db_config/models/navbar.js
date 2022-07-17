'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Navbar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Navbar.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    icon: {
      allowNull: false,
      type: DataTypes.STRING
    },
    url :{
      allowNull: true,
      type: DataTypes.STRING
    },
    class: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING
    },
    parent_element_id: {
      allowNull: true,
      type: DataTypes.STRING
    },
    parent_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    lang: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Navbar',
  });
  return Navbar;
};