'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employee.hasMany(models.NoFPrint, {
        foreignKey: 'emp_id',
        sourceKey: 'id'
      });
    }
  };
  Employee.init({
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    father_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sex: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    q_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    y_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    SSN: {
      type: DataTypes.STRING,
      allowNull: false
    },
    FIN: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    home_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shift_start_t: {
      type: DataTypes.TIME,
      allowNull: false
    },
    shift_end_t: {
      type: DataTypes.TIME,
      allowNull: false
    },
    j_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    j_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    dayoff_days_total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    department: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    working_days: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    position_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Employee',
    paranoid: true
  });

// Employee.associate = models => {
//   Employee.hasMany(models.NoFPrint, {
//     foreignKey: {
//       allowNull: false
//     }
//   });
// }

  return Employee;
};