const { sequelize, Fine, ForgivenFine } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");
const dateObj = new Date("10/1/2021");
let month = dateObj.getMonth();
const date = dateObj.getDate();
const year = dateObj.getFullYear();
if (date !== 1) {
    month += 1;
}

module.exports = {
    getFineData: async (role, limit, offset) => {
        let query, countQuery;
        const result = {};
        if (role === 2) {
            query = `
                SELECT fn.id as fineID, fn.emp_id, fn.minute_total, fn.fine_minute, fn.fine_status, fn.updatedAt, emp.first_name, emp.last_name, emp.father_name FROM Fines as fn
                LEFT JOIN Employees as emp ON fn.emp_id = emp.id
                WHERE fn.fine_minute > 0
                ORDER BY fn.createdAt DESC
                LIMIT :limit OFFSET :offset
            `;
            countQuery = `
                SELECT COUNT(*) as count FROM Fines as fn
                LEFT JOIN Employees as emp ON fn.emp_id = emp.id
                WHERE fn.fine_minute > 0
                ORDER BY fn.createdAt DESC
            `
        } else {
            query = `
                SELECT fn.id as fineID, fn.emp_id, fn.minute_total, fn.fine_minute, fn.fine_status, fn.updatedAt, emp.first_name, emp.last_name, emp.father_name FROM Fines as fn
                LEFT JOIN Employees as emp ON fn.emp_id = emp.id
                WHERE (fn.minute_total > 0 OR fn.fine_minute > 0)
                ORDER BY fn.createdAt DESC
                LIMIT :limit OFFSET :offset
            `;
            countQuery = `
                SELECT COUNT(*) as count FROM Fines as fn
                LEFT JOIN Employees as emp ON fn.emp_id = emp.id
                WHERE (fn.minute_total > 0 OR fn.fine_minute > 0)
                ORDER BY fn.createdAt DESC
            `
        }
        result.fineData = await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                limit,
                offset
            }
        });

        result.fineCount = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT
        });

        return result;
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
    },
    insertForgivenData: async (data, cb) => {
        ForgivenFine.create({
            fine_id: data.fine_id,
            user_id: data.user_id,
            emp_id: data.emp_id,
            minute_total: data.minute_total,
            forgiven_minute: data.forgivenData
        }, {
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    getAllForgivenData: async (offset) => {
        const result = {};
        result.forgiven_fines = await sequelize.query(`
            SELECT ff.*, emp.first_name, emp.last_name, emp.father_name FROM ForgivenFines as ff
            LEFT JOIN Employees as emp ON emp.id = ff.emp_id
            AND emp.deletedAt IS NULL
            LIMIT 15 OFFSET :offset
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                offset
            }
        });

        result.forgiven_user = await sequelize.query(`
            SELECT usr.id, emp.first_name, emp.last_name, emp.father_name FROM ForgivenFines as ff
            LEFT JOIN Users as usr ON usr.id = ff.user_id
            LEFT JOIN Employees as emp ON usr.emp_id = emp.id
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });

        result.forgiven_fines_count = await sequelize.query(`
            SELECT COUNT(*) as count FROM ForgivenFines as ff
            LEFT JOIN Employees as emp ON emp.id = ff.emp_id
            AND emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });

        return result;
    },
    getForgivenDataByEmployee: async (id) => {
        return await sequelize.query(`
            SELECT ff.*, emp.first_name, emp.last_name, emp.father_name FROM ForgivenFines as ff
            LEFT JOIN Employees as emp ON emp.id = ff.emp_id
            WHERE ff.id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    updateFine: (data, cb) => {
        Fine.update({
            user_id: data.id,
            minute_total: data.minute_total
        }, {
            where: {
                id: data.id
            },
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    }
}