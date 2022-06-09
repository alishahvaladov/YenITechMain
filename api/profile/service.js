const { sequelize, TimeOffRequest, User } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    renderProfile: async (id) => {
        return await sequelize.query(`
            SELECT usr.username, usr.email, emp.*, pos.name as posName, proj.name as projName, dept.name as deptName FROM Users as usr
            LEFT JOIN Employees as emp ON usr.emp_id = emp.id
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            LEFT JOIN Departments as dept ON emp.department = dept.id
            WHERE usr.id = :id
            AND (emp.deletedAt IS NULL OR usr.deletedAt IS NULL)
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                id
            }
        })
    },
    getProfilePicture: async (id) => {
        return await sequelize.query(`
            SELECT emp.id, emp.first_name, emp.last_name, emp.father_name, efd.uploaded_files FROM Employees as emp
            LEFT JOIN Users as usr ON emp.id = usr.emp_id
            LEFT JOIN EmployeeFileDirectories as efd ON emp.id = efd.emp_id
            WHERE emp.deletedAt IS NULL
            AND usr.id = :id 
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    getUserDataAsEmployee: async (user_id) => {
        return await sequelize.query(`
            SELECT emp.id, emp.first_name, emp.last_name, emp.father_name, dept.name as deptName, proj.name as projName, pos.name as posName 
            FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            LEFT JOIN Departments as dept ON emp.department = dept.id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            WHERE usr.id = :user_id
            AND emp.deletedAt IS NULL
            AND usr.deletedAt IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                user_id
            }
        });
    },
    addTimeOff: (data, cb) => {
        TimeOffRequest.create({
            emp_id: data.emp_id,
            user_id: data.user_id,
            timeoff_type: data.timeOffType,
            timeoff_start_date: data.timeOffStartDate,
            timeoff_end_date: data.timeOffEndDate,
            timeoff_job_start_date: data.wStartDate,
            timoff_time: data.toffTime,
            timoff_time_date: data.toffTimeDate,
            status: 1
        }, {
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        })
    },
    getUsername: async (id) => {
        return await sequelize.query(`
            SELECT username FROM Users
            WHERE id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    getSalaryByMonthsForUser: async (data) => {
        const result = {};
        const replacements = {};

        let query = `
            SELECT * FROM SalaryByMonths
            WHERE emp_id = :emp_id
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM SalaryByMonths
            WHERE emp_id = :emp_id
        `;

        if (data.qMin !== "" && data.qMin) {
            query += `
                AND salary_cost > :qMin
            `;
            countQuery += `
                AND salary_cost > :qMin
            `;
            replacements.qMin = data.qMin;
        }

        if (data.qMax !== "" && data.qMax) {
            query += `
                AND salary_cost < :qMax
            `;
            countQuery += `
                AND salary_cost < :qMax
            `;
            replacements.qMax = data.qMax;
        }

        if (data.qDate !== "" && data.qDate) {
            query += `
                AND salary_date = :qDate
            `;
            countQuery += `
                AND salary_date = :qDate
            `;
            replacements.qDate = data.qDate;
        }
        replacements.emp_id = data.emp_id;
        replacements.offset = data.offset;
        query += "LIMIT 15 OFFSET :offset";

        result.salaries = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements
        });

        result.count = await sequelize.query(countQuery, {
            type: QueryTypes.SELECT,
            replacements
        });

        return result;
        
    },
    getUserTimeOffs: async (user_id, limit, offset) => {
        const result = {};
        let query = `
            SELECT toff.*, emp.first_name, emp.last_name, emp.father_name FROM TimeOffRequests AS toff
            LEFT JOIN Employees AS emp ON emp.id = toff.emp_id
            LEFT JOIN Users AS usr ON emp.id = usr.emp_id
            WHERE usr.id = :user_id
            LIMIT :limit OFFSET :offset
        `;
        let countQuery = `
            SELECT COUNT(*) AS count FROM TimeOffRequests AS toff
            LEFT JOIN Employees AS emp ON emp.id = toff.emp_id
            LEFT JOIN Users AS usr ON emp.id = usr.emp_id
            WHERE usr.id = :user_id
        `;

        result.myTimeOffs = await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                user_id,
                limit,
                offset
            }
        });
        result.myTimeOffsCount = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                user_id
            }
        });

        return result;
    },
    changePassword: (data, cb) => {
        User.update({
            password: data.password
        }, {
            where: {
                id: data.user_id
            },
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    getUserPassword: async (user_id) => {
        return await sequelize.query(`
            SELECT password FROM Users
            WHERE id = :user_id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                user_id
            }
        });
    },
    getAllSalariesForUser: async (data) => {
        const replacements = {};

        let query = `
            SELECT sal.*, emp.first_name, emp.last_name, emp.father_name FROM SalaryByMonths as sal
            LEFT JOIN Employees AS emp ON emp.id = sal.emp_id
            LEFT JOIN Users AS usr ON usr.emp_id = emp.id
            WHERE usr.id = :user_id
        `;

        if (data.qMin !== "" && data.qMin) {
            query += `
                AND sal.salary_cost > :qMin
            `;
            replacements.qMin = data.qMin;
        }

        if (data.qMax !== "" && data.qMax) {
            query += `
                AND sal.salary_cost < :qMax
            `;
            replacements.qMax = data.qMax;
        }

        if (data.qDate !== "" && data.qDate) {
            query += `
                AND sal.salary_date = :qDate
            `;
            replacements.qDate = data.qDate;
        }
        replacements.user_id = data.user_id;
        return await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
    }
}