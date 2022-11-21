'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AccessGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Right, {
        through: 'AccessGroupRight'
      }),
      this.belongsToMany(models.User, {
        through: 'UserAccessGroup'
      })
    }
  }
  AccessGroup.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'AccessGroup',
  });
  return AccessGroup;
};