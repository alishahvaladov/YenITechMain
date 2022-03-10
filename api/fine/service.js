const { sequelize, Fine } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");
const dateObj = new Date("10/1/2021");
let month = dateObj.getMonth();
const date = dateObj.getDate();
const year = dateObj.getFullYear();
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
            SELECT cfd.*, emp.first_name, emp.last_name, emp.father_name FROM CalculatedFineData as cfd
            LEFT JOIN Employees as emp ON emp.id = cfd.emp_id
            WHERE cfd.emp_id = :id
            AND MONTH(cfd.f_print_date) = :month 
            AND YEAR(cfd.f_print_date) = :year 
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id,
                month,
                year
            }
        });
    }
}