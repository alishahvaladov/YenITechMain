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
    getFineData: async (role, limit, offset, body) => {
        let query, countQuery;
        const replacements = {};
        const result = {};
        console.log(body)
        if (role === 2) {
            query = `
                SELECT fn.id as fineID, fn.emp_id, fn.minute_total, fn.fine_minute, fn.fine_status, fn.updatedAt, emp.first_name, emp.last_name, emp.father_name FROM Fines as fn
                LEFT JOIN Employees as emp ON fn.emp_id = emp.id
                WHERE fn.fine_minute > 0
            `;
            countQuery = `
                SELECT COUNT(*) as count FROM Fines as fn
                LEFT JOIN Employees as emp ON fn.emp_id = emp.id
                WHERE fn.fine_minute > 0
            `;
        } else {
            query = `
                SELECT fn.id as fineID, fn.emp_id, fn.minute_total, fn.fine_minute, fn.fine_status, fn.updatedAt, emp.first_name, emp.last_name, emp.father_name FROM Fines as fn
                LEFT JOIN Employees as emp ON fn.emp_id = emp.id
                WHERE (fn.minute_total > 0 OR fn.fine_minute > 0)`;
            countQuery = `
                SELECT COUNT(*) as count FROM Fines as fn
                LEFT JOIN Employees as emp ON fn.emp_id = emp.id
                WHERE (fn.minute_total > 0 OR fn.fine_minute > 0)`;
        }

        if (body.qEmployee && body.qEmployee !== "") {
            const splittedEmp = body.qEmployee.split(" ");
            if (splittedEmp.length === 1) {
                query += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee)
                `;
                countQuery += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
            }
            if (splittedEmp.length === 2) {
                query += `
                    AND ((emp.first_name like :qEmployee AND emp.last_name like :qEmployee2) OR (emp.first_name like :qEmployee AND emp.father_name like :qEmployee2) OR (emp.last_name like :qEmployee AND emp.father_name like :qEmployee2))
                `;
                countQuery += `
                    AND ((emp.first_name like :qEmployee AND emp.last_name like :qEmployee2) OR (emp.first_name like :qEmployee AND emp.father_name like :qEmployee2) OR (emp.last_name like :qEmployee AND emp.father_name like :qEmployee2))
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
            }
            if (splittedEmp.length === 3) {
                query += `
                    AND (emp.first_name like :qEmployee AND emp.last_name like :qEmployee2 AND emp.father_name like :qEmployee3)
                `;
                countQuery += `
                    AND (emp.first_name like :qEmployee AND emp.last_name like :qEmployee2 AND emp.father_name like :qEmployee3)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
                replacements.qEmployee3 = `%${splittedEmp[2]}%`;
            }
        }
        if (body.qMinuteTotalMin && body.qMinuteTotalMin !== "") {
            query += `
                AND fn.minute_total > :qMinuteTotalMin
            `;
            countQuery += `
                AND fn.minute_total > :qMinuteTotalMin
            `;
            replacements.qMinuteTotalMin = body.qMinuteTotalMin;
        }

        if (body.qMinuteTotalMax && body.qMinuteTotalMax !== "") {
            query += `
                AND fn.minute_total < :qMinuteTotalMax
            `;
            countQuery += `
                AND fn.minute_total < :qMinuteTotalMax
            `;
            replacements.qMinuteTotalMax = body.qMinuteTotalMax;
        }

        if (body.qApprovedFineMin && body.qApprovedFineMin !== "") {
            query += `
                AND fn.fine_minute > :qApprovedFineMin
            `;
            countQuery += `
                AND fn.fine_minute > :qApprovedFineMin
            `;
            replacements.qApprovedFineMin = body.qApprovedFineMin;
        }

        if (body.qApprovedFineMax && body.qApprovedFineMax !== "") {
            query += `
                AND fn.fine_minute < :qApprovedFineMax
            `;
            countQuery += `
                AND fn.fine_minute < :qApprovedFineMax
            `;
            replacements.qApprovedFineMax = body.qApprovedFineMax;
        }

        if(body.qDate && body.qDate !== "") {
            const splittedqDate = body.qDate.split(".");
            if (splittedqDate.length === 2) {
                query += `
                    AND (MONTH(fn.updatedAt) = :qMonth AND YEAR(fn.updatedAt) = :qYear)
                `;
                countQuery += `
                    AND (MONTH(fn.updatedAt) = :qMonth AND YEAR(fn.updatedAt) = :qYear)
                `;
                replacements.qMonth = splittedqDate[0];
                replacements.qYear = splittedqDate[1];
            }
        }

        query += `
            ORDER BY fn.createdAt DESC
            LIMIT :limit OFFSET :offset
        `;

        replacements.limit = limit;
        replacements.offset = offset;

        result.fineData = await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });

        result.fineCount = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
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
    },
    getFineDataForExport: async (role, body) => {
        const replacements = {};
        let query;
        if (role === 2) {
            query = `
                SELECT fn.id as fineID, fn.emp_id, fn.minute_total, fn.fine_minute, fn.fine_status, fn.updatedAt, emp.first_name, emp.last_name, emp.father_name FROM Fines as fn
                LEFT JOIN Employees as emp ON fn.emp_id = emp.id
                WHERE fn.fine_minute > 0
            `;
        } else {
            query = `
                SELECT fn.id as fineID, fn.emp_id, fn.minute_total, fn.fine_minute, fn.fine_status, fn.updatedAt, emp.first_name, emp.last_name, emp.father_name FROM Fines as fn
                LEFT JOIN Employees as emp ON fn.emp_id = emp.id
                WHERE (fn.minute_total > 0 OR fn.fine_minute > 0)`;
        }

        if (body.qEmployee && body.qEmployee !== "") {
            const splittedEmp = body.qEmployee.split(" ");
            if (splittedEmp.length === 1) {
                query += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
            }
            if (splittedEmp.length === 2) {
                query += `
                    AND ((emp.first_name like :qEmployee AND emp.last_name like :qEmployee2) OR (emp.first_name like :qEmployee AND emp.father_name like :qEmployee2) OR (emp.last_name like :qEmployee AND emp.father_name like :qEmployee2))
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
            }
            if (splittedEmp.length === 3) {
                query += `
                    AND (emp.first_name like :qEmployee AND emp.last_name like :qEmployee2 AND emp.father_name like :qEmployee3)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
                replacements.qEmployee3 = `%${splittedEmp[2]}%`;
            }
        }
        if (body.qMinuteTotalMin && body.qMinuteTotalMin !== "") {
            query += `
                AND fn.minute_total > :qMinuteTotalMin
            `;
            replacements.qMinuteTotalMin = body.qMinuteTotalMin;
        }

        if (body.qMinuteTotalMax && body.qMinuteTotalMax !== "") {
            query += `
                AND fn.minute_total < :qMinuteTotalMax
            `;
            replacements.qMinuteTotalMax = body.qMinuteTotalMax;
        }

        if (body.qApprovedFineMin && body.qApprovedFineMin !== "") {
            query += `
                AND fn.fine_minute > :qApprovedFineMin
            `;
            replacements.qApprovedFineMin = body.qApprovedFineMin;
        }

        if (body.qApprovedFineMax && body.qApprovedFineMax !== "") {
            query += `
                AND fn.fine_minute < :qApprovedFineMax
            `;
            replacements.qApprovedFineMax = body.qApprovedFineMax;
        }

        if(body.qDate && body.qDate !== "") {
            const splittedqDate = body.qDate.split(".");
            if (splittedqDate.length === 2) {
                query += `
                    AND (MONTH(fn.updatedAt) = :qMonth AND YEAR(fn.updatedAt) = :qYear)
                `;
                replacements.qMonth = splittedqDate[0];
                replacements.qYear = splittedqDate[1];
            }
        }

        return await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
    }
}