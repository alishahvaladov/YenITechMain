const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { User, sequelize } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");
const socket = require("../socket/socket");
const { getUserGroup } = require("../../api/users/service");

const fileDirectories = async (id) => {
    return await sequelize.query(`
            SELECT empd.uploaded_files, emp.id, emp.first_name, emp.last_name, emp.father_name FROM Users as usr
            LEFT JOIN EmployeeFileDirectories as empd ON usr.emp_id = empd.emp_id
            LEFT JOIN Employees as emp ON usr.emp_id = emp.id
            WHERE usr.id = :id
        `, {
        logging: false,
        type: QueryTypes.SELECT,
        replacements: {
            id
        }
    });
}

module.exports = function (passport) {
    passport.use(
      new localStrategy(
          (username, password, done) => {
              User.findOne({
                  where: {
                      username: username
                  },
                  logging: false
              }).then((user) => {
                  if(!user) {
                      return done(null, false, {
                          message: "Username or password is incorrect"
                      })
                  }
                  bcrypt.compare(password, user.password, (err, isMatch) => {
                      if (err) throw err;
                      if(isMatch) {
                          return done(null, user);
                      } else {
                          return done(null, false, {
                              message: "Username or password is incorrect"
                          });
                      }
                  });
              });
          }
      )
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
       User.findOne({
           where: {
               id: id
           },
           logging: false
       }).then(async (user) => {
           const fileDirectoriesData = await fileDirectories(user.id);
           const parsedFileDirectories = JSON.parse(fileDirectoriesData[0].uploaded_files);
           if(parsedFileDirectories) {
            const recruitmentDirectories = JSON.parse(parsedFileDirectories.recruitment);
            let empName = fileDirectoriesData[0].first_name;
            empName = empName.toLowerCase();
            let empSurname = fileDirectoriesData[0].last_name;
            empSurname = empSurname.toLowerCase();
            let empFatherName = fileDirectoriesData[0].father_name;
            empFatherName = empFatherName.toLowerCase();
            const profilePicture = recruitmentDirectories.profilePicture;
            user.dataValues.profilePicture = `/employees/directs/recruitment/${fileDirectoriesData[0].id}-${empName}-${empSurname}-${empFatherName}/${profilePicture[0].filename}`;
           }
           user.dataValues.groups = (await getUserGroup(user.id)).map(group => ({id: group.id, name: group.name}));
           delete user.dataValues.password;
           done(null, user.get());
       })
    });
}

