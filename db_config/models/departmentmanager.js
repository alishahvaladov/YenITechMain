'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DepartmentManager extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DepartmentManager.belongsTo(models.Employee, {
        as: 'd_emp',
        foreignKey: 'emp_id',
        targetKey: 'id'
      })
    }
  };
  DepartmentManager.init({
    emp_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Employees',
        key: 'id',
        as: 'emp_id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'DepartmentManager'
  });
  return DepartmentManager;
};