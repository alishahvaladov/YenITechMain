'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NoFPrint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        NoFPrint.belongsTo(models.Employee, {
          as: 'emp',
          foreignKey: 'emp_id',
          targetKey: 'id'
        });
    }
  };
  NoFPrint.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      allowNull: false,
      type: DataTypes.DATEONLY
    },
    create_user_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    update_user_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    delete_user_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    enter_sign_time: {
      type: DataTypes.TIME
    },
    leave_sign_time: {
      type: DataTypes.TIME
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATEONLY
    }
  }, {
    sequelize,
    modelName: 'NoFPrint',
    paranoid: true
  });

  return NoFPrint;
};