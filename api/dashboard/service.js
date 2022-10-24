const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../db_config/models");
const date = new Date();

const month = date.getMonth();

module.exports = {
    getEmployeeCount: async () => {
        return await sequelize.query(`
            SELECT COUNT(*) as count FROM Employees
            WHERE deletedAt  IS NULL
            AND j_end_date IS NULL
        `, {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    getLastMonthSalaryCount: async (month) => {
        return await sequelize.query(`
            SELECT SUM(sbm.salary_cost) AS salarySum FROM SalaryByMonths as sbm
            LEFT JOIN Employees as emp ON emp.id = sbm.emp_id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            AND MONTH(sbm.salary_date) = :month
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                month: month - 1
            }
        });
    },
    getLastNotifications: async (role) => {
        return await sequelize.query(`
            SELECT nf.* FROM Notifications AS nf
            LEFT JOIN Users AS usr ON usr.role = nf.belongs_to_role
            LEFT JOIN Employees AS emp ON emp.id = usr.id
            WHERE (nf.belongs_to_role = :role OR :role = 1)
            ORDER BY nf.createdAt DESC
            LIMIT 10 OFFSET 0
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                role
            }
        });
    },
    getInappropriateFPrintsCount: async () => {
        return await sequelize.query(`
            SELECT COUNT(*) AS count FROM ForgottenFPrints as ffp
            WHERE ffp.f_print_time_entrance IS NULL
            OR ffp.f_print_time_exit IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
    },
    getLastMonthEmployeeCount: async (month) => {
        return await sequelize.query(`
            SELECT COUNT(*) AS count FROM Employees
            WHERE deletedAt IS NULL
            AND MONTH(j_start_date) = :month
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                month
            }
        });
    },
    getSalarySumForEachDepartment: async (user_id) => {
        return await sequelize.query(`
            SELECT SUM(sal.salary_cost) as gross, dept.name FROM SalaryByMonths AS sal
            LEFT JOIN Employees AS emp ON emp.id = sal.emp_id
            LEFT JOIN Departments AS dept ON emp.department = dept.id
            LEFT JOIN Projects AS proj ON emp.project_id = proj.id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            AND dept.name IS NOT NULL
            AND MONTH(salary_date) = :month
            AND emp.project_id = (
                SELECT emp.project_id FROM Employees AS emp
                LEFT JOIN Users AS usr ON usr.emp_id = emp.id
                WHERE usr.id = :user_id
            )
            GROUP BY emp.department
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                user_id,
                month
            }
        });
    },
    getGivenSalariesByMonths: async (year) => {
        return await sequelize.query(`
            SELECT SUM(salary_cost) as cost, MONTH(salary_date) as months FROM SalaryByMonths
            WHERE YEAR(salary_date) = :year
            GROUP BY MONTH(salary_date)
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                year
            }
        });
    },
    getLastTimeOffs: async () => {
        return await sequelize.query(`
            SELECT tor.*, emp.first_name, emp.last_name, emp.father_name FROM TimeOffRequests as tor
            LEFT JOIN Employees AS emp ON emp.id = tor.emp_id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            ORDER BY tor.created_at DESC
            LIMIT 8 OFFSET 0
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
    }
}