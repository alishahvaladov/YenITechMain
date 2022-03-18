const { QueryTypes } = require("sequelize");
const { Salary, Employee, sequelize } = require("../../db_config/models");

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
    getSalaries: async () => {
        return await sequelize.query(`
            SELECT sal.* FROM Salaries as sal
            LEFT JOIN Employees as emp ON emp.id = sal.emp_id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
    }
}