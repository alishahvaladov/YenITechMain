'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AGroupNavbarRel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AGroupNavbarRel.init({
    nav_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agroup_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'AGroupNavbarRel',
    createdAt: false,
    updatedAt: false
  });
  AGroupNavbarRel.removeAttribute("id");
  return AGroupNavbarRel;
};