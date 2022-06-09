const { addTimeOff, getTimeOffs, getTimeOff, addTimeOffNonUser, getTimeOffNonUser } = require("./timeoff.service");
const { TimeOffRequest } = require("../../db_config/models");
const config = require("../../config/config.json");
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
    renderTimeOffPage: (req, res) => {
        if (req.user.role === 5) {
            return res.render("time-off-request/timeoffrequests", {
                hr: true
            });
        } else if (req.user.role === 1 ) {
            return res.render("time-off-request/timeoffrequests", {
                super_admin: true
            });
        } else if (req.user.role === 10 ) {
            return res.render("time-off-request/timeoffrequests", {
                deptDirector: true
            });
        }
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
    },
    addTimeOffNonUser: (req, res) => {
        try {
            const data = req.body;
            const timeOffType = data.timeoff_type;
            if (parseInt(timeOffType) === 4) {
                data.timeoff_start_date = null;
                data.timeoff_end_date = null;
            } else {
                const timeOffStartDate = new Date(data.timeoff_start_date);
                const timeOffEndDate = new Date(data.timeoff_end_date);
                console.log(timeOffStartDate);
                console.log(timeOffEndDate);
                if (timeOffStartDate.getTime() > timeOffEndDate.getTime()) {
                    req.flash("error_msg", "Please choose valid time off dates");
                    return res.redirect("/timeoffrequests/add-toff-non-user");
                };
            }
            addTimeOffNonUser(data, (err, result) => {
                if(err) {
                    console.log(err);
                    req.flash("error_msg", "An unknown error has been occurred please contact System Admin");
                    return res.redirect("/timeoffrequests/add-toff-non-user");
                }
                console.log(result);
                req.flash("success_msg", "Time off request has been added");
                return res.redirect("/timeoffrequests");
            });
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "Ups... Something went wrong");
            return res.redirect("/timeoffrequests/add-toff-non-user");
        }
    },
    getTimeOffNonUser: async (req, res) => {
        errors = [];
        try {
            const result = await getTimeOffNonUser();
            let tOffTypes = config.day_offs;
            if(req.user.role === 1) {
                return res.render("time-off-request/toff_request_hr", {
                    result,
                    super_admin: true,
                    tOffTypes
                });
            } else if (req.user.role === 5) {
                return res.render("time-off-request/toff_request_hr", {
                    result,
                    hr: true,
                    tOffTypes
                });
            }
        } catch (err) {
            console.log(err);
            errors.push({msg: "An unknown error has been occurred please contact System Admin"});
            if(req.user.role === 1) {
                return res.render("time-off-request/toff_request_hr", {
                    errors,
                    super_admin: true
                });
            } else if (req.user.role === 5) {
                return res.render("time-off-request/toff_request_hr", {
                    errors,
                    hr: true
                });
            }
        }
    },
    renderApproveTimeOffHR: async (req, res) => {
        const id = req.params.id;
        if(req.user.role === 1) {
            return res.render("time-off-request/request-single", {
                super_admin: true,
                id
            });
        } else if (req.user.role === 5) {
            return res.render("time-off-request/request-single", {
                hr: true,
                id
            });
        }
    },
    renderApproveTimeOffDR: async (req, res) => {
        const id = req.params.id;
        if(req.user.role === 1) {
            return res.render("time-off-request/request-single", {
                super_admin: true,
                id
            });
        } else if (req.user.role === 5) {
            return res.render("time-off-request/request-single", {
                hr: true,
                id
            });
        } else if (req.user.role === 10) {
            return res.render("time-off-request/request-single", {
                deptDirector: true,
                id
            });
        }
    }
}