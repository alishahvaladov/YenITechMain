const { registerUser, deleteUser, getUsers, getUser, updateUser, renderRegister, activateUser, forgotPassword, updatePassword} = require("./user.service");
const { User, sequelize } = require("../../db_config/models");
const { addNotification } = require("../../notification/service");
const passport = require("passport");
const {QueryTypes} = require("sequelize");
const jsonConfig = require("../../config/config.json");
const nodemailer = require("nodemailer"); 

let errors = [];

const mailTest = (mail, subject, mailContent) => {
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "mail.yenihayat.az",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "yenihayat.local\\no-reply", // generated ethereal user
                pass: "Nr203030!@", // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"No Reply" <no-reply@yenihayat.az>', // sender address
            to: mail, // list of receivers
            subject: subject, // Subject line
            text: mailContent, // plain text body
            html: `${mailContent}`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);
};
const passwordGenerator = () => {
    let password = '';
    let uppCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lowCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    let numbers = "1234567890";
    let symbols = "!@#$%^&*()";
    for (let i = 0; i < 3; i++) {
        let uppChar = Math.floor(Math.random() * uppCaseLetters.length + 1);
        password += uppCaseLetters.charAt(uppChar);
        for (let y = 0; y < 2; y++) {
            let symChar = Math.floor(Math.random() * symbols.length + 1);
            password += symbols.charAt(symChar);
            for (let k = 0; k < 1; k++) {
                let numChar = Math.floor(Math.random() * numbers.length + 1);
                password += numbers.charAt(numChar);
                for (let j = 0; j < 1; j++) {
                    let lowChar = Math.floor(Math.random() * lowCaseLetters.length + 1);
                    password += lowCaseLetters.charAt(lowChar);
                }
            }
        }
    }
    return password;
}

module.exports = {
    renderRegister: async (req, res) => {
        errors = [];
        try {
            const result = await renderRegister();
            res.render('users/register', {
                result,
            });
        } catch (err) {
            console.log(err);
            errors.push({msg: "Unknown error has been occurred please contact System Admin"});
            res.render('users/register', {
                errors
            });
        }
    },
    register: (req, res) => {
        errors = [];
        const data = req.body;
        const userFirstLetter = data.username[0];
        const splitUser = data.username.split('');
        const password = passwordGenerator();
        data.password = password;
        let mail = data.email;
        let subject = "Created User";
        let mailContent = `
            Hörmətli istifadəçi sizin üçün nəzərdə tutulmuş istifadəçi artıq yaradılmışdır. Zəhmət olmasa aşağıda verilən istifadəçi adı və şifrə ilə sistemə daxil olasınız.
            Hesaba giriş edəbilmədiyiniz təqdirdə Sistem Administratoru ilə əlaqə saxlamağınız xahiş olunur.
            <br>
            <br>
            <br>
            <b>İstifadəçi Adı</b>: ${data.username}
            <br>
            <b>Şifrə</b>: ${password}
        `
        if(typeof parseInt(data.emp_id) !== typeof 1) {
            console.log("Please select existing employee");
            req.flash("error_msg", "Please select existing employee");
            return res.redirect("/register");
        }
        if(isNaN(parseInt(userFirstLetter)) === false) {
            console.log("Username cannot start with number");
            req.flash("error_msg", "Username cannot start with number");
            return res.redirect("/register");
        }
        if((/[a-zA-Z]/).test(userFirstLetter) === false) {
            console.log("Username cannot start with symbol");
            req.flash("error_msg", "Username cannot start with symbol");
            return res.redirect("/register");
        }
        if(splitUser) {
            for (let i = 0; i < splitUser.length; i++) {
                if((/[a-zA-Z0-9.]/).test(splitUser[i]) === false) {
                    console.log("Username cannot contain symbols");
                    req.flash("error_msg", "Username cannot contain symbols");
                    return res.redirect("/register");
                }
            }
            if (splitUser.length < 6) {
                console.log("Username must be minimum 6 characters");
                req.flash("error_msg", "Username must be minimum 6 characters");
                return res.redirect("/register");
            }
        }

        User.findOne({
            where: {
                username: data.username
            }
        }).then((user) => {
            if(user) {
                req.flash("error_msg", "Username already exists");
                console.log("Username already exists");
            }
        });
        User.findOne({
            where: {
                emp_id: data.emp_id
            }
        }).then((user) => {
            if(user) {
                req.flash("error_msg", "This employee already registered");
                return res.redirect("/register");
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
                        mailTest(mail, subject, mailContent);
                        req.flash("success_msg", "You have registered successfully")
                        return res.redirect('/register');
                    });
                }
            }
        });

    },
    login: (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash: 'Username or password is incorrect'
        })(req, res, next);
    },
    logout: (req, res, next) => {
        req.logout(function(err) {
            if (err) { return next(err) }
            req.flash("success_msg", "You are logged out");
            return res.redirect('/login')
        });
    },
    userDelete: (req, res) => {
        const deleteData = {};
        const id = req.params.id;
        const deleted_by = req.user.id;
        deleteData.id = id;
        deleteData.deleted_by = deleted_by;
        User.findOne({
            where: {
                id: id
            }
        }).then((result) => {
            const notificationData = {};
            if(result.dataValues.role === 1) {
                req.flash("error_msg", "This user doesn't exist");
                return res.redirect("/users");
            }
            deleteUser(deleteData, (err, deleteResult) => {
                if (err) {
                    console.log(err);
                    req.flash("error_msg", "This user doesn't exist");
                    return res.redirect("/users");
                };
                notificationData.header = "İstifadəçi silindi";
                notificationData.description = `${result.dataValues.username} istifadəçisinin hesabı ${req.user.username} tərəfindən silindi`;
                notificationData.created_by = req.user.id;
                notificationData.belongs_to_role = 7;
                notificationData.belongs_to_table = "Users";
                notificationData.url = "/users/deleted-users";
                notificationData.importance = 2;

                addNotification(notificationData, (err, result) => {
                    if (err) {
                        console.log(err);
                        req.flash('error_msg', "Ups... Something went wrong!");
                        return res.redirect("/users");
                    }
                    req.flash("success_msg", "This user has been deleted");
                    return res.redirect("/users");
                });
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
            } else if (req.user.role === 2) {
                res.render("users/users", {
                    result,
                    admin: true
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
            } else if (req.user.role === 2) {
                res.render("users/users", {
                    result,
                    admin: true
                });
            }
        }
    },
    getUser: async (req, res) => {
        const id = req.params.id;
        return res.render("users/user-update");
    },
    updateUser: (req, res) => {
        const data = req.body;
        const id = req.params.id;
        const roles = jsonConfig.roles;

        const result = updateUser(id, data, (err, result) => {
            if (err) {
                console.log(err);
                req.flash("error_msg", "An unknown error has been occurred");
                return res.redirect(`/users/update/${id}`);
            }
            req.flash("success_msg", "User has been updated");
            return res.redirect("/users");
        });
    },
    activate: async (req, res) => {
        return res.render("change-password/change-password");
    },
    activateUser: async (req, res) => {
        let data = req.body;
        let id = req.user.id;
        let password = req.body.password;
        let rePassword = req.body.re_password;
        if (password !== rePassword) {
            req.flash("error_msg", "Passwords do not match please try again");
            return res.redirect("/update-password");
        }
        const splitPass = req.body.password.split('');
        const lWithNoNumb = data.password.replace(/[0-9]/g, "");
        if (splitPass) {
            for (let i = 0; i < lWithNoNumb.length; i++) {
                let lastLetter = parseInt(lWithNoNumb[lWithNoNumb.length - 1]);
                if(lWithNoNumb[i] === lWithNoNumb[i].toUpperCase()) {
                    break;
                } else if(i === lWithNoNumb.length - 1 && lWithNoNumb[lWithNoNumb.length-1] !== lWithNoNumb[lWithNoNumb.length-1].toUpperCase()) {
                    console.log("Password must be contain at least 1 upper case letter");
                    console.log("Last: " + isNaN(lastLetter));
                    req.flash("error_msg", "Password must be contain at least 1 upper case letter");
                    return res.redirect("/update-password")
                }
            }

            for (let i = 0; i < splitPass.length; i++) {
                if(isNaN(parseInt(splitPass[i])) === false) {
                    break;
                } else if(i === splitPass.length - 1 && isNaN(parseInt(splitPass[i])) !== false) {
                    console.log("Password must be contain at least 1 number");
                    console.log("Splittetd is: " + splitPass[i]);
                    req.flash("error_msg", "Password must be contain at leas 1 number");
                    return res.redirect("/update-password");
                }
            }
            for (let i = 0; i < splitPass.length; i++) {
                if((/[a-zA-Z0-9]/).test(splitPass[i]) === false) {
                    console.log("SplitPass: " + typeof splitPass[i] + " " + splitPass[i]);
                    break;
                } else if(i === splitPass.length - 1 && (/[a-zA-Z0-9]/).test(splitPass[i]) === true) {
                    console.log("Password must contain at least 1 symbol");
                    req.flash("error_msg", "Password must contain at least 1 symbol");
                    return res.redirect("/update-password");
                }
            }
            for (let i = 0; i < splitPass.length; i++) {
                if(splitPass[i] === " ") {
                    console.log("Password cannot contain space please try again!");
                    req.flash("error_msg", "Password cannot contain space please try again!");
                    return res.redirect("/update-password");
                }
            }
            if (splitPass.length < 9) {
                console.log("Password must me minimum 8 characters");
                req.flash("error_msg", "Password must me minimum 8 characters");
                return res.redirect("/update-password");
            }

            if(lWithNoNumb.length === 0) {
                console.log("Password must be contain at least 1 letter");
                req.flash("error_msg", "Password must be contain at least 1 letter");
                return res.redirect("/update-password");
            }
        }

        try {
            await activateUser(id, password);
            req.flash("success_msg", "Your account successfully activated");
            return res.redirect("/dashboard");
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "An unknown error has been occurred");
            return res.redirect("/update-password");
        }
    },
    forgotPassword: (req, res) => {
        let userInput = req.body.user_input;
        const password = passwordGenerator();
        forgotPassword(userInput, password, (err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "Username or email is incorrect");
                return res.redirect("/forgot-password");
            }
            const username = result.username;
            let email = result.email;
            let subject = "Reset Password";
            let mailContent = `
            Your password has been reset successfully
            <br>
            <br>
            <br>
            <b>İstifadəçi adı: </b> ${username}
            <br>
            <b>Şifrə: </b> ${password} 
        `;
            mailTest(email, subject, mailContent);
            // console.log(result);
            req.flash("success_msg", "Your password has been changed please check your email");
            return res.redirect("/login");
        })
    },
    renderDeletedUsers: (req, res) => {
        try {
            if (req.user.role === 1) {
                return res.render("users/deleted-users", {
                    super_admin: true
                });
            } else if (req.user.role === 2) {
                return res.render("users/deleted-users", {
                    admin: true
                });
            } else if (req.user.role === 5) {
                return res.render("users/deleted-users", {
                    hr: true
                });
            } else if (req.user.role === 7) {
                return res.render("users/deleted-users", {
                    deptDirector: true
                });
            } else if (req.user.role === 10) {
                return res.render("users/deleted-users", {
                    deptDirector: true
                });
            }
        } catch (err) {
            console.log(err);
            req.flasht("error_msg", "Error has been occurred while loading page. Please contact system admin");
            return res.redirect("/dashboard");
        }
    }
}