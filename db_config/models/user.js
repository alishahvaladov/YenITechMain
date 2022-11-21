const bcrypt = require("bcryptjs");

'use strict';
const {
  Model, where
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.AccessGroup, {
        through: 'UserAccessGroup'
      })
    }
  };
  User.init({
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
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    active_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    hooks: {
      beforeCreate: async (User, option) => {
        User.password = bcrypt.hashSync(User.password, 10);
      },
      beforeBulkUpdate: (User, where) => {
        if(User.attributes.password !== undefined) {
          User.attributes.password = bcrypt.hashSync(User.attributes.password, 10);
        }
      }
    },
    sequelize,
    modelName: 'User',
    paranoid: true
  });
  return User;
};