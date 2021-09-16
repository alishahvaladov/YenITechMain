const { addFPrint, getNoFPrints, update, renderAdd} = require("./nofprint.service");
const { Employee } = require("../../db_config/models");
let errors = [];

module.exports = {
    renderAdd: (req, res) => {
        errors = [];
        renderAdd((err, result) => {
            if(err) {
                console.log(err);
                errors.push({msg: "An unknown error has been occurred"});
                return res.render("nofprint/nofprint", {
                    errors
                });
            }
            console.log(result);
            if(req.user.role === 5) {
                return res.render("nofprint/nofprint", {
                    employees: result,
                    hr: true
                });
            } else if (req.user.role === 1) {
                return res.render("nofprint/nofprint", {
                    employees: result,
                    super_admin: true
                });
            }
        })
    },
    addFPrint: (req, res) => {
        errors = [];
        const data = req.body;
        data.create_user_id = req.user.id;

        Employee.findOne({
            where: {
                id: data.id
            }
        }).then((result) => {
            if(result) {
                console.log(result);
                req.flash('error_msg', "An unknown error has been occurred");
                return res.redirect("/nofprint/add-nofprint");
            }
            req.flash("success_msg", "Record has been added");
            return res.redirect("/nofprint");
        })

        if(errors.length === 0) {
            addFPrint(data, (err, result) => {
               if(err) {
                   console.log(err);
                   req.flash("error_msg", "An unknown error has been occurred");
                   return res.redirect("/nofprint/add-nofprint");
               }
               req.flash("success_msg", "NoFPrint added successfully");
               return res.redirect("/nofprint");
            });
        }
    },
    getNoFPrints: (req, res) => {
        errors = [];
        getNoFPrints((err, result) => {
            if (err) {
                console.log(err);
                errors.push({msg: "No record found for today"});
                if(req.user.role === 5) {
                    return res.render("nofprint/nofprints", {
                        errors,
                        hr: true
                    });
                } else if (req.user.role === 1) {
                    return res.render("nofprint/nofprints", {
                        errors,
                        super_admin: true
                    });
                }
            } else {
                if(!result) {
                    console.log(result)
                    errors.push({msg: "No record found for today"});
                    if(res.user.role === 5) {
                        return res.render("nofprint/nofprints", {
                            errors,
                            hr: true
                        });
                    } else if (req.user.role === 1) {
                        return res.render("nofprint/nofprints", {
                            errors,
                            super_admin: true
                        });
                    }
                }
                for (let i = 0; i < result.length; i++) {
                    result[i].dataValues.enter_sign_time = result[i].dataValues.enter_sign_time.slice(0, -3);
                    if(result[i].dataValues.leave_sign_time) {
                        result[i].dataValues.leave_sign_time = result[i].dataValues.leave_sign_time.slice(0, -3);
                    }
                    console.log("Enter " + i + ": " + result[i].dataValues.enter_sign_time);
                    console.log("Leave " + i + ": " + result[i].dataValues.leave_sign_time);
                }
                if (req.user.role === 5) {
                    res.render("nofprint/nofprints", {
                        nofprints: result,
                        hr: true
                    });
                } else if (req.user.role === 1) {
                    console.log(result[0].dataValues.emp.dataValues);
                    res.render("nofprint/nofprints", {
                        nofprints: result,
                        super_admin: true
                    });
                }
            }
        })
    },
    update: (req, res) => {
        const id = req.params.id;
        const user_id = req.user.id;
        update(id, user_id,(err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "This fingerprint record not found please try again");
                return res.redirect("/nofprint");
            } else {
                req.flash("success_msg", "Status successfully changed");
                return res.redirect("/nofprint");
            }
        });
    }
}