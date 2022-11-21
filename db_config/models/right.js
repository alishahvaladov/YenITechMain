'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Right extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.AccessGroup,{
        through: 'AccessGroupRight',
      }, {
        foreignKey: 'right_id'
      })
    }
  }
  Right.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Right',
  });
  return Right;
};