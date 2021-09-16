const { addTimeOff, getTimeOffs, getTimeOff } = require("./timeoff.service");
const { TimeOffRequest } = require("../../db_config/models");
let errors = [];

module.exports = {
    addTimeOff: (req, res) => {
        errors = [];
        let data = req.body;
        data.emp_id = req.user.emp_id;
        addTimeOff(data, (err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "An unknown error has been occurred");
                return res.redirect("/timeoffrequests/requests");
            };
            req.flash("success_msg", "Your Time Off Request added please wait until approved");
            return res.redirect("/timeoffrequests/requests");
        })
    },
    getTimeOffs: (req, res) => {
        getTimeOffs((err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "There are no any time off request");
                return res.redirect("/timeoffrequests");
            } else {
                console.log(result)
                if (req.user.role === 5) {
                    return res.render("time-off-requests/timeoffrequests", {
                        timeoffrequests: result,
                        hr: true
                    });
                } else if (req.user.role === 1 ) {
                    return res.render("time-off-request/timeoffrequests", {
                        timeoffrequests: result,
                        super_admin: true
                    });
                }
            }
        })
    },
    getTimeOff: (req, res) => {
        const id = req.params.id;
        errors = [];
        getTimeOff(id, (err, result) => {
            if(err) {
                console.log(err);
                req.flash("error_msg", "An unknown error occurred.")
                return res.redirect("/timeoffrequests");
            }
            console.log(result);
            if(req.user.role === 5) {
                res.render("time-off-request/single", {
                    hr: true,
                    toff: result
                });
            } else if (req.user.role === 1) {
                res.render("time-off-request/single", {
                    super_admin: true,
                    toff: result
                });
            }
        });
    }
}