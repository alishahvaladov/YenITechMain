const { Fine } = require("../../db_config/models");
const {Op, QueryTypes} = require("sequelize");
const {sequelize} = require("../../db_config/models/index");
const date = new Date();
const month = date.getMonth();
const year = date.getFullYear();



module.exports = {
    addFine: async (data, cb) => {
        Fine.update({
            minute_total: data.minute_total
        }, {
            where: {
                emp_id: data.emp_id
            }
        }, {
            logging: false
        }).then((result) => {
            cb(null, result);
        }).catch((err) => {
            cb(err);
        });
    },
    getFineData: async (emp_id) => {
        return await sequelize.query(`
            SELECT * FROM Fines WHERE emp_id = :emp_id
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                emp_id
            }
        });
    },
    addEmpFineDataIfNotExists: async (data, cb) => {
        Fine.create({
            emp_id: data.emp_id,
            minute_total: data.minute_total,
            fine_minute: data.fine_minute,
            fine_status: data.fine_status
        }, {
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    getFprints: async (date, emp_id) => {
        return await sequelize.query(`
            SELECT fp.*, emp.first_name, emp.last_name, emp.father_name, emp.shift_start_t, emp.shift_end_t FROM FPrints as fp
            LEFT JOIN Employees as emp ON fp.emp_id = emp.id
            WHERE fp.f_print_date = :date
            AND fp.emp_id = :emp_id
            AND emp.position_id != 17
            ORDER BY fp.f_print_time ASC
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                date: `2021-09-${date.toString()}`,
                emp_id
            }
        });
    },
    getEmployeeID: async () => {
        return await sequelize.query(`
            SELECT id FROM Employees
        `, {
            type: QueryTypes.SELECT,
            logging: false
        });
    }
}