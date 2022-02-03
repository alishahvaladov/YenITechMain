const { TimeOffRequest, sequelize } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    addTimeOff: (data, cb) => {
        TimeOffRequest.create({
            emp_id: data.emp_id,
            timeoff_type: data.timeoff_type,
            timeoff_description: data.timeoff_description,
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
    },
    addTimeOffNonUser: (data, cb) => {
        TimeOffRequest.create({
            emp_id: data.emp_id,
            timeoff_type: data.timeoff_type,
            timeoff_description: data.timeoff_description,
            timoff_start_date: data.timeoff_start_date,
            timeoff_end_date: data.timeoff_end_date,
            timeoff_job_start_Date: data.timeoff_start_date,
            status: 0
        }, {
            logging: false
        }).then((timeOff) => {
            console.log(timeOff);
            cb(null, timeOff);
        }).catch((err) => {
            cb(err);
        });
    },
    getTimeOffNonUser: async () => {
        return await sequelize.query("SELECT id, first_name, last_name, father_name, sex FROM Employees WHERE deletedAt IS NULL", {
            type: QueryTypes.SELECT,
            logging: false
        });
    }
}