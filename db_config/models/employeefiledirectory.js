'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeFileDirectory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  EmployeeFileDirectory.init({
    emp_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    insert_user: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    update_user: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    delete_user: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    uploaded_files: {
      allowNull: false,
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'EmployeeFileDirectory',
  });
  return EmployeeFileDirectory;
};