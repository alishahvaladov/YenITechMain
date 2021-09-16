const { Salary, Employee } = require("../../db_config/models");

module.exports = {
    getSalaryPage: (id, cb) => {
        Employee.findOne({
            attributes: ['id', 'first_name', 'last_name', 'father_name', 'dayoff_days_total'],
            where: {
                id: id
            }
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    },

    addSalary: (data, cb) => {
        Salary.create({
            emp_id: data.emp_id,
            user_id: data.user_id,
            unofficial_net: data.unofficial_net,
            unofficial_pay: data.unofficial_pay,
            gross: data.gross,
            dsmf: data.dsmf,
            h_insurance: data.h_insurance,
            unemployment: data.unemployment,
            unpaid_day_off: data.unpaid_day_off,
            daily_payment: data.daily_payment,
            net: data.net
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    },
    getSalaries: (cb) => {
        Salary.findAll({
            order: [['createdAt', 'DESC']]
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    }
}