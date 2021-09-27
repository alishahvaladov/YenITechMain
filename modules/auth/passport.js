const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { User } = require("../../db_config/models");

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
                  console.log(user);
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
       }).then((user) => {
           done(null, user.get());
       })
    });
}

