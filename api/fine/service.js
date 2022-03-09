const { sequelize, Fine } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");
const dateObj = new Date("10/1/2022");
let month = dateObj.getMonth();
const date = dateObj.getDate();
if (date !== 1) {
    month += 1;
}

module.exports = {
    getFineData: async (role) => {
        let query;
        if (role === 2) {
            query = `
                SELECT fn.id as fineID, fn.emp_id, fn.minute_total, fn.fine_minute, fn.fine_status, fn.updatedAt, emp.first_name, emp.last_name, emp.father_name FROM Fines as fn
                LEFT JOIN Employees as emp ON fn.emp_id = emp.id
                WHERE fn.fine_minute > 0
                ORDER BY fn.createdAt DESC
            `
            console.log('admin');
        } else {
            query = `
                SELECT fn.id as fineID, fn.emp_id, fn.minute_total, fn.fine_minute, fn.fine_status, fn.updatedAt, emp.first_name, emp.last_name, emp.father_name FROM Fines as fn
                LEFT JOIN Employees as emp ON fn.emp_id = emp.id
                WHERE (fn.minute_total > 0 OR fn.fine_minute > 0)
                ORDER BY fn.createdAt DESC
            `
            console.log('hr');
        }
        return await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT
        });
    },
    getFineDataByID: async (id) => {
        return await sequelize.query(`
            SELECT * FROM Fines
            WHERE id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        })
    },
    approveEditedFine: (data, cb) => {
        Fine.update({
            fine_minute: data.fine_minute,
        }, {
            where: {
                id: data.id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
           cb(err);
        });
    },
    deleteFromFine: (data, cb) => {
        Fine.update({
            minute_total: data.deletedMinute
        }, {
            where: {
                id: data.id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    approveFine: (data, cb) => {
        Fine.update({
           minute_total: 0,
           fine_minute: data.fine_minute
        }, {
            where: {
                id: data.id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    resetApprovedFine: (data, cb) => {
        Fine.update({
            fine_minute: 0,
            minute_total: data.minute_total
        }, {
            where: {
                id: data.id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    getFinedData: async (id) => {
        return await sequelize.query(`
            SELECT fp.* FROM FPrints as fp
            LEFT JOIN Employees as emp ON fp.emp_id = emp.id
            WHERE ((fp.f_print_time > emp.shift_start_t AND fp.f_print_time < "13:00:00")
            OR (fp.f_print_time < emp.shift_end_t AND fp.f_print_time > "18:00:00"))
            AND fp.emp_id = :id
            AND MONTH(fp.f_print_date) = :month
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id,
                month
            }
        });
    }
}