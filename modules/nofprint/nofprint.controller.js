const { addFPrint, update, renderAdd} = require("./nofprint.service");
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
        try {
            return res.render("nofprint/nofprints");
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "Ups... Something went wrong!");
            return res.redirect("/dashboard");
        }
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