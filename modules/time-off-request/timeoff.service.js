const { TimeOffRequest } = require("../../db_config/models");

module.exports = {
    addTimeOff: (data, cb) => {
        TimeOffRequest.create({
            emp_id: data.emp_id,
            timeoff_type: data.timeoff_type,
            timeoff_description: data.timeoff_description,
            priority: data.priority,
            timeoff_start_date: data.timeoff_start_date,
            timeoff_end_date: data.timeoff_end_date,
            timeoff_job_start_date: data.timeoff_job_start_date,
            status: 0
        }).then((timeoff) => {
            console.log(timeoff);
            cb();
        }).catch((err) => {
            if (err) cb(err);
        });
    },
    getTimeOffs: (cb) => {
        TimeOffRequest.findAll().then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        })
    },
    getTimeOff: (id, cb) => {
        TimeOffRequest.findOne({
            where: {
                id: id
            }
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    }
}