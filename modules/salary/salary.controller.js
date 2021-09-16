const { getSalaryPage, addSalary, getSalaries } = require("./salary.service");
let errors = [];

module.exports = {
    getSalaryPage: (req, res) => {
        errors = [];
        const id = req.params.id;
        getSalaryPage(id, (err, result) => {
            if(err) {
                console.log(err);
                errors.push({msg: "An unknown error occurred"});
                if(req.user.role === 5) {
                    return res.render("salary/add", {
                        errors,
                        hr: true
                    });
                } else if (req.user.role === 1) {
                    return res.render("salary/add", {
                        errors,
                        super_admin: true
                    });
                }
            }
            console.log(result);
            return res.render("salary/add", {
                employee: result
            })
        });
    },
    addSalary: (req, res) => {
        errors = [];
        const data = req.body;
        if(data.gross > 200) {
            data.dsmf = 10;
        } else {
            data.dsmf = 3;
        }
        data.h_insurance = 1;
        data.unemployment = 0.5;
        data.unpaid_day_off = 0;
        if (data.unofficial_net == '') {
            data.unofficial_net = null;
        }
        if (data.unofficial_pay == '') {
            data.unofficial_pay = null;
        }
        let tax = 0;
        if(data.gross > 200) {
            tax = ((((parseInt(data.gross) - 200) * data.dsmf / 100) + 6) + (parseInt(data.gross) * data.h_insurance / 100) + (parseInt(data.gross) * data.unemployment / 100));
            tax = parseFloat(tax.toFixed(2));
        } else {
            tax = (((parseInt(data.gross) - 200) * data.dsmf / 100) + (parseInt(data.gross) * data.h_insurance / 100) + (parseInt(data.gross) * data.unemployment / 100));
            tax = parseFloat(tax.toFixed(2));
        }
        let net = 0;

        if (data.unofficial_net !== null) {
            net = parseInt(data.unofficial_net) + tax;
        } else if (data.unofficial_pay !== null) {
            net = parseInt(data.gross) + parseInt(data.unofficial_pay);
        } else {
            net = parseInt(data.gross);
        }
        data.daily_payment = 0;
        data.net = net;
        data.user_id = req.user.id;

        if (parseInt(data.unofficial_net) <= parseInt(data.gross) - tax) {
            console.log("User: " + req.user.id + "Unofficial Net is: " + data.unofficial_net);
            req.flash("error_msg", "Please be sure UN is not equal or less than Gross");
            return res.redirect("/salaries/salary/" + data.emp_id);
        }

        addSalary(data, (err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "An unknown error has been occurred");
                return res.redirect("/employee/update/" + data.emp_id);
            }
            console.log(result);
            req.flash("success_msg", "Salary has been updated successfully");
            return res.redirect("/salaries");
        });
    },
    getSalaries: (req, res) => {
        getSalaries((err, result) => {
            if (err) {
                console.log(err);
                req.flash("error_msg", "An unknown error has been occurred");
                return res.redirect("/salaries");
            }
            console.log(result);
            if(req.user.role === 5) {
                return res.render("salary/salaries", {
                    salary: result,
                    hr: true
                });
            } else if(req.user.role === 1) {
                return res.render("salary/salaries", {
                    salary: result,
                    super_admin: true
                });
            }
        });
    }
}