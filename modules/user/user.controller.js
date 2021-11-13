const { registerUser, deleteUser, getUsers, getUser, updateUser, renderRegister} = require("./user.service");
const { User, sequelize } = require("../../db_config/models");
const passport = require("passport");
const {QueryTypes} = require("sequelize");
const jsonConfig = require("../../config/config.json");
const nodemailer = require("nodemailer");
let errors = [];

module.exports = {
    renderRegister: async (req, res) => {
        errors = [];
        const roles = jsonConfig.roles;
        try {
            const result = await renderRegister();
            if (req.user.role === 5) {
                res.render('users/register', {
                    hr: true,
                    result,
                    roles
                });
            } else if (req.user.role === 1) {
                res.render('users/register', {
                    super_admin: true,
                    result,
                    roles
                })
            }
        } catch (err) {
            console.log(err);
            errors.push({msg: "Unknown error has been occurred please contact System Admin"});
            if (req.user.role === 5) {
                res.render('users/register', {
                    hr: true,
                    errors
                });
            } else if (req.user.role === 1) {
                res.render('users/register', {
                    super_admin: true,
                    errors
                })
            }
        }
    },
    register: (req, res) => {
        errors = [];
        const data = req.body;
        const userFirstLetter = data.username[0];
        const splitUser = data.username.split('');
        const lWithNoNumb = data.password.replace(/[0-9]/g, "");
        console.log(lWithNoNumb);
        const splitPass = data.password.split('');
        if(typeof parseInt(data.emp_id) !== typeof 1) {
            console.log("Please select existing employee");
            errors.push({msg: "Please select existing employee"});
        }
        if(isNaN(parseInt(userFirstLetter)) === false) {
            console.log("Username cannot start with number");
            errors.push({msg: "Username cannot start with number"});
            console.log(errors);
        }
        if((/[a-zA-Z]/).test(userFirstLetter) === false) {
            console.log("Username cannot start with symbol");
            errors.push({msg: "Username cannot start with symbol"});
        }
        if(splitUser) {
            for (let i = 0; i < splitUser.length; i++) {
                if((/[a-zA-Z0-9.]/).test(splitUser[i]) === false) {
                    console.log("Username cannot contain symbols");
                    errors.push({msg: "Username cannot contain symbols"})
                    break;
                }
            }
            if (splitUser.length < 6) {
                console.log("Username must be minimum 6 characters");
                errors.push({msg: "Username must be minimum 6 characters"});
            }
        }
        if(lWithNoNumb.length === 0) {
            console.log("Password must be contain at least 1 letter");
            errors.push({msg: "Password must be contain at least 1 letter"});
        }
        if (splitPass) {
            for (let i = 0; i < lWithNoNumb.length; i++) {
                let pLetter = parseInt(lWithNoNumb[i]);
                let lastLetter = parseInt(lWithNoNumb[lWithNoNumb.length - 1]);
                // console.log("Parsed: " + isNaN(pLetter) === 'true');
                // console.log("Last: " + isNaN(lastLetter));
                if(lWithNoNumb[i] === lWithNoNumb[i].toUpperCase()) {
                    break;
                } else if(i === lWithNoNumb.length - 1 && lWithNoNumb[lWithNoNumb.length-1] !== lWithNoNumb[lWithNoNumb.length-1].toUpperCase()) {
                    console.log("Password must be contain at least 1 upper case letter");
                    console.log("Last: " + isNaN(lastLetter));
                    errors.push({msg: "Password must be contain at least 1 upper case letter"});
                    break;
                }
            }

            for (let i = 0; i < splitPass.length; i++) {
                if(isNaN(parseInt(splitPass[i])) === false) {
                    break;
                } else if(i === splitPass.length - 1 && isNaN(parseInt(splitPass[i])) !== false) {
                    console.log("Password must be contain at least 1 number");
                    errors.push({
                        msg: "Password must be contain at leas 1 number"
                    })
                    console.log("Splittetd is: " + splitPass[i]);
                    break;
                }
            }

            for (let i = 0; i < splitPass.length; i++) {
                if((/[a-zA-Z0-9]/).test(splitPass[i]) === false) {
                    console.log("SplitPass: " + typeof splitPass[i] + " " + splitPass[i]);
                    break;
                } else if(i === splitPass.length - 1 && (/[a-zA-Z0-9]/).test(splitPass[i]) === true) {
                    console.log("Password must contain at least 1 symbol");
                    errors.push({msg: "Password must contain at least 1 symbol"});
                    break;
                }
            }

            for (let i = 0; i < splitPass.length; i++) {
                if(splitPass[i] === " ") {
                    console.log("Password cannot contain space please try again!");
                    errors.push({msg: "Password cannot contain space please try again!"});
                    break;
                }
            }
            if (splitPass.length < 9) {
                console.log("Password must me minimum 8 characters");
                errors.push({msg: "Password must me minimum 8 characters"});
            }
            console.log(errors);
        }

        User.findOne({
            where: {
                username: data.username
            }
        }).then((user) => {
            if(user) {
                errors.push({msg: "Username already exists"});
                console.log("Username already exists");
            }
        });
        User.findOne({
            where: {
                emp_id: data.emp_id
            }
        }).then((user) => {
            if(user) {
                errors.push({msg: "This employee already registered"});
                console.log("This employee already registered")
                console.log("Emp error: " + errors.length);
                res.render('users/register', {
                    errors
                });
            }
            if (errors.length === 0) {
                if (data.role == 1) {
                    req.flash("error_msg", "Please enter valid role");
                    return res.redirect("/register");
                } else {
                    registerUser(data, (err, results) => {
                        if(err) {
                            console.log("Error: " + err.message);
                            if (req.user.role === 5) {
                                return res.render("users/register", {
                                    errors,
                                    hr: true
                                });
                            } else if (req.user.role === 1) {
                                return res.render("users/register", {
                                    errors,
                                    super_admin: true
                                });
                            }
                        }
                        async function main() {
                            // Generate test SMTP service account from ethereal.email
                            // Only needed if you don't have a real mail account for testing

                            // create reusable transporter object using the default SMTP transport
                            let transporter = nodemailer.createTransport({
                                host: "smtp.ethereal.email",
                                port: 587,
                                secure: false, // true for 465, false for other ports
                                auth: {
                                    user: "sienna.lehner79@ethereal.email", // generated ethereal user
                                    pass: "mp5gWtbzVNXaYzJH8x", // generated ethereal password
                                },
                                tls: {
                                    rejectUnauthorized: false
                                }
                            });

                            // send mail with defined transport object
                            let info = await transporter.sendMail({
                                from: '"Test User" <test@ethereal.email>', // sender address
                                to: "Ali.Shahveledov@yenihayat.az", // list of receivers
                                subject: "Test", // Subject line
                                text: "Test", // plain text body
                                html: "<b>Test</b>", // html body
                            });

                            console.log("Message sent: %s", info.messageId);
                            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                            // Preview only available when sending through an Ethereal account
                            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                        }

                        main().catch(console.error);

                        req.flash("success_msg", "You have registered successfully")
                        return res.redirect('/register');
                    });
                }
            }
        });

    },
    login: (req, res, next) => {
        console.log(req.body);
        passport.authenticate("local",  {
            successRedirect: "/dashboard",
            failureRedirect: "/login",
            failureFlash: true
        })(req, res, next);
    },
    logout: (req, res) => {
      req.logout();
      req.flash("success_msg", "You are logged out");
      return res.redirect("/login");
    },
    userDelete: (req, res) => {
        const id = req.params.id;
        User.findOne({
            where: {
                id: id
            }
        }).then((result) => {
            if(result.dataValues.role === 1) {
                req.flash("error_msg", "This user doesn't exist");
                return res.redirect("/users");
            }
            deleteUser(id, (err, result) => {
                if (err) {
                    console.log(err);
                    req.flash("error_msg", "This user doesn't exist");
                    return res.redirect("/users");
                };
                req.flash("success_msg", "This user has been deleted");
                return res.redirect("/users");
            });
        }).catch((err) => {
            if (err) {
                console.log(err);
                req.flash("error_msg", "This user doesn't exist");
                return res.redirect("/users");
            }
        })
    },
    getUsers: async (req, res) => {
        errors = [];
        try {
            let result = await getUsers();
            if(req.user.role === 1) {
                res.render("users/users", {
                   result,
                   super_admin: true
                });
            } else if (req.user.role === 5) {
                res.render("users/users", {
                    result,
                    hr: true
                });
            }
        } catch (err) {
            console.log(err);
            errors.push({msg: "An unknown error has been occurred please contact System Admin"});
            if(req.user.role === 1) {
                res.render("users/users", {
                    errors,
                    super_admin: true
                });
            } else if (req.user.role === 5) {
                res.render("users/users", {
                    errors,
                    hr: true
                });
            }
        }
    },
    getUser: (req, res) => {
        const id = req.params.id;
        getUser(id, (err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "This User doesn't exist");
                return res.redirect("/users");
            }
            console.log(result.dataValues);
            if(req.user.role === 1) {
                return res.render("users/user-update", {
                    user: result.dataValues,
                    super_admin: true
                });
            } else if (req.user.role === 5) {
                return res.render("users/user-update", {
                    user: result.dataValues,
                    hr: true
                });
            }
        })
    },
    updateUser: (req, res) => {
        const data = req.body;
        const id = req.params.id;

        console.log(data.role);

        if (data.role == 1) {
            req.flash("error_msg", "Please choose valid role");
            return res.redirect("/users/update/" + id);
        } else {
            updateUser(id, data, (err, result) => {
                if(err) {
                    console.log(err);
                    req.flash("error_msg", "An unknown error occurred please contact System Admin");
                    return res.redirect("/users/update/" + id);
                }
                console.log(result);
                req.flash("success_msg", "The user has been updated.");
                return res.redirect("/users/update/" + id);
            });
        }
    }
}