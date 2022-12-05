'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config, {
    logging: false
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config, {
    logging: false
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ! TODO: uncomment this line when you deploy to production
//#region Access Control Records
// const initialRights = ["create", "read", "update", "delete"];
// const ignoreList = [
//   "AccessGroupRight",
//   "AccessGroupNavbarRel",
//   "FPrintDraft",
//   "HolidayName",
//   "Navbar",
//   "Notification",
//   "Right",
//   "Role",
//   "SequelizeMeta",
//   "RoleNavbarRel",
//   "TaxAndFine",
//   "TimeOffDateLeft",
//   "TimeOffType",
//   "UserAccessGroup",
//   "ProjDeptRel",
//   "PosGroupRel",
//   "DepartmentProjectDirectorRel",
//   "DeptGroupRel",
// ];
// const entities = Object.keys(db.sequelize.models).filter((entity) => !ignoreList.includes(entity));
// entities.forEach((entity) => {
//   initialRights.forEach((right) => {
//     db.sequelize.models.Right.findOne({ where: { name: `${entity}_${right}` } }).then((isExist) => {
//       if (!isExist) {
//         db.sequelize.models.Right.create({ name: `${entity}_${right}` });
//       }
//     });
//   });
// });
// ignoreList = undefined;
//#endregion

module.exports = db;
