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
        
        const fPrintTime = data.enter_sign_time;
        const fPrintDate = data.enter_sign_date;

        if(fPrintDate === "" || fPrintDate === " " || fPrintDate === null) {
            req.flash("error_msg", "Please select Enter Sign Date");
            return res.redirect("/nofprint/add-nofprint");
        }

        if(fPrintTime === "" || fPrintTime === " " || fPrintTime === null) {
            req.flash("error_msg", "Please select Enter Sign Time");
            return res.redirect("/nofprint/add-nofprint");
        }

        Employee.findOne({
            where: {
                id: data.emp_id
            }
        }).then((result) => {
            if(!result) {
                req.flash('error_msg', "This employee doesn't exist please try again");
                return res.redirect("/nofprint/add-nofprint");
            }
        })

        if(errors.length === 0) {
            addFPrint(data, (err, result) => {
               if(err) {
                   console.log(err);
                   req.flash("error_msg", "An unknown error has been occurred");
                   return res.redirect("/nofprint/add-nofprint");
               }
               req.flash("success_msg", "NoFPrint added successfully");
               return res.redirect("/all-fprints");
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
        const data = req.body;
        const user_id = req.user.id;
        update(data, user_id,(err, result) => {
            if(err) {
                console.log(err);
                return res.status(404).send({
                    success: false,
                    message: "This fingerprint record not found please try again"
                });
            }
            return res.status(204).send({
                success: false,
                message: "Status successfully changed"
            });
        });
    }
}