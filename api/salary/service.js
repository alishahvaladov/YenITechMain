const { Salary, SalaryByMonth, sequelize } = require("../../db_config/models");
const { QueryTypes } = require("sequelize");

module.exports = {
    getSalary: async () => {
        return await sequelize.query(`
            SELECT sl.* FROM Salaries as sl
            LEFT JOIN Employees as emp ON sl.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
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
                AND status = 1
            `, {
                type: QueryTypes.SELECT,
                logging: false,
                replacements: {
                    emp_id
                }
            });
    }
}