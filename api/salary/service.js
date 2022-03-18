const { Salary, SalaryByMonth, sequelize } = require("../../db_config/models");
const { QueryTypes } = require("sequelize");

module.exports = {
    getSalary: async () => {
        return await sequelize.query(`
            SELECT sl.*, emp.working_days, emp.first_name, emp.last_name, emp.father_name FROM Salaries as sl
            LEFT JOIN Employees as emp ON sl.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
    },
    getSalaryByMonthByEmpID: async (emp_id) => {
        return await sequelize.query(`
            SELECT sbm.* FROM SalaryByMonths as sbm
            WHERE sbm.emp_id = :emp_id
            ORDER BY salary_date DESC
            LIMIT 12 OFFSET 0
        `,
        {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                emp_id
            }
        });
    },
    getFines: async (emp_id) => {
        return await sequelize.query(`
            SELECT * FROM Fines
            WHERE emp_id = :emp_id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                emp_id
            }
        });
    },
    getTimeOffs: async (emp_id) => {
        return await sequelize.query(`
                SELECT * FROM TimeOffRequests
                WHERE emp_id = :emp_id
                AND status = 4
            `, {
                type: QueryTypes.SELECT,
                logging: false,
                replacements: {
                    emp_id
                }
            });
    },
    getFPrints: async(month, emp_id) => {
        return await sequelize.query(`
            SELCT * FROM FPrints 
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
    }, 
    getEmployeeExperience: async (emp_id) => {
        return await sequelize.query(`
            SELECT * FROM EmployeeExperiences
            WHERE emp_id = :emp_id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                emp_id
            }
        })
    },
    getSalariesByMonth: async () => {
        return await sequelize.query(`
            SELECT sbm.*, emp.first_name, emp.last_name, emp.father_name FROM SalaryByMonths as sbm
            LEFT JOIN Employees as emp ON emp.id = sbm.emp_id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
    },
    getMonthlyWorkingDays: async (limit) => {
        return await sequelize.query(`
            SELECT * FROM MonthlyWorkDays
            ORDER BY year DESC, month DESC
            LIMIT :limit OFFSET 0
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                limit
            }
        });
    },
    addCalculatedGrossToDB: (data, cb) => {
        SalaryByMonth.create({
            emp_id: data.emp_id,
            salary_date: data.salary_date,
            salary_cost: data.salary_cost
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    }
}