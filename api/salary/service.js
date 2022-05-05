const { Salary, SalaryByMonth, sequelize } = require("../../db_config/models");
const { QueryTypes } = require("sequelize");

module.exports = {
    getSalary: async (offset) => {
        const result = {};
        result.salaries = await sequelize.query(`
            SELECT sl.*, emp.working_days, emp.first_name, emp.last_name, emp.father_name FROM Salaries as sl
            LEFT JOIN Employees as emp ON sl.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            LIMIT 15 OFFSET :offset
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                offset
            }
        });

        result.count = await sequelize.query(`
            SELECT COUNT(*) as count FROM Salaries as sl
            LEFT JOIN Employees as emp ON sl.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `, {
            type: QueryTypes.SELECT,
            logging: false,
        });

        return result;
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
    getSalariesByMonth: async (offset) => {
        const result = {};
        result.salaries = await sequelize.query(`
            SELECT sbm.*, emp.first_name, emp.last_name, emp.father_name FROM SalaryByMonths as sbm
            LEFT JOIN Employees as emp ON emp.id = sbm.emp_id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            LIMIT 15 OFFSET :offset
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                offset
            }
        });

        result.count = await sequelize.query(`
            SELECT COUNT(*) as count FROM SalaryByMonths as sbm
            LEFT JOIN Employees as emp ON emp.id = sbm.emp_id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });

        return result;
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
    },
    search: async (data) => {
        let query = `
            SELECT slr.*, emp.first_name, emp.last_name, emp.father_name FROM Salaries as slr
            LEFT JOIN Employees as emp ON slr.emp_id = emp.id
            WHERE emp.deletedAt IS NULL 
            AND emp.j_end_date IS NULL
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM Salaries as slr
            LEFT JOIN Employees as emp ON slr.emp_id = emp.id
            WHERE emp.deletedAt IS NULL 
            AND emp.j_end_date IS NULL
        `;
        const result = {};
        let replacements = {};
        const emp = data.emp;
        const uPay = parseInt(data.uPay);
        const min = data.min;
        const max = data.max;

        if (emp !== null && emp !== "" && emp !== " ") {
            const splitEmp = emp.split(' ');
            if(splitEmp.length === 1) {
                query += `
                    AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)
                `
                countQuery += `
                    AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)
                `
                replacements.empName = `%${splitEmp[0]}%`;
            }
            if(splitEmp.length === 2) {
                query += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))
                `
                countQuery += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))
                `
                replacements.empName = `%${splitEmp[0]}%`;
                replacements.empName2 = `%${splitEmp[1]}%`;
            }
            if (splitEmp.length > 2) {
                query += `
                    AND (emp.first_name like :empName AND emp.last_name like :empName2 AND emp.father_name like :empName3)
                `
                countQuery += `
                    AND (emp.first_name like :empName AND emp.last_name like :empName2 AND emp.father_name like :empName3)
                `
                replacements.empName = `%${splitEmp[0]}%`;
                replacements.empName2 = `%${splitEmp[1]}%`;
                replacements.empName3 = `%${splitEmp[2]}%`;
            }
        }
        if (uPay === 1 || uPay === 2) {
            if (uPay === 1) {
                query += `
                    AND slr.unofficial_pay IS NOT NULL
                `
                countQuery += `
                    AND slr.unofficial_pay IS NOT NULL
                `
            }
            if (uPay === 2) {
                query += `
                    AND slr.unofficial_pay IS NULL
                `
                countQuery += `
                    AND slr.unofficial_pay IS NULL
                `
            }
        }
        if (min !== null && min !== "" && min !== " ") {
            query += `
                AND slr.gross >= :min
            `
            countQuery += `
                AND slr.gross >= :min
            `
            replacements.min = min;
        }
        if (max !== null && max !== "" && max !== " ") {
            query += `
                AND slr.gross <= :max
            `
            countQuery += `
                AND slr.gross <= :max
            `
            replacements.max = max;
        }
        query += `
            LIMIT 15 OFFSET :offset
        `;
        replacements.offset = parseInt(data.offset) * 15;
        result.salaries = await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
        result.count = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
        return result;
    },
    searchSalaryByMonts: async (data) => {
        let query = `
            SELECT sbm.*, emp.first_name, emp.last_name, emp.father_name FROM SalaryByMonths as sbm
            LEFT JOIN Employees as emp ON sbm.emp_id = emp.id
            WHERE emp.deletedAt IS NULL 
            AND emp.j_end_date IS NULL
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM SalaryByMonths as sbm
            LEFT JOIN Employees as emp ON sbm.emp_id = emp.id
            WHERE emp.deletedAt IS NULL 
            AND emp.j_end_date IS NULL
        `;
        const result = {};
        let replacements = {};
        const emp = data.emp;
        const month = data.month;
        const year = data.year;
        const min = data.min;
        const max = data.max;

        if (emp !== null && emp !== "" && emp !== " ") {
            const splitEmp = emp.split(' ');
            if(splitEmp.length === 1) {
                query += `
                    AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)
                `
                countQuery += `
                    AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)
                `
                replacements.empName = `%${splitEmp[0]}%`;
            }
            if(splitEmp.length === 2) {
                query += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))
                `
                countQuery += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))
                `
                replacements.empName = `%${splitEmp[0]}%`;
                replacements.empName2 = `%${splitEmp[1]}%`;
            }
            if (splitEmp.length > 2) {
                query += `
                    AND (emp.first_name like :empName AND emp.last_name like :empName2 AND emp.father_name like :empName3)
                `
                countQuery += `
                    AND (emp.first_name like :empName AND emp.last_name like :empName2 AND emp.father_name like :empName3)
                `
                replacements.empName = `%${splitEmp[0]}%`;
                replacements.empName2 = `%${splitEmp[1]}%`;
                replacements.empName3 = `%${splitEmp[2]}%`;
            }
        }
        if (month !== null && month !== "" && month !== " " && month !== "Ay") {
            query += `
                AND MONTH(sbm.salary_date) = :month
            `
            countQuery += `
                AND MONTH(sbm.salary_date) = :month
            `
            replacements.month = month;
        }
        if (year !== null && year !== "" && year !== " " && year !== "İl") {
            query += `
                AND YEAR(sbm.salary_date) = :year
            `
            countQuery += `
                AND YEAR(sbm.salary_date) = :year
            `
            replacements.year = year;
        }
        if (min !== null && min !== "" && min !== " ") {
            query += `
                AND sbm.salary_cost >= :min
            `
            countQuery += `
                AND sbm.salary_cost >= :min
            `
            replacements.min = min;
        }
        if (max !== null && max !== "" && max !== " ") {
            query += `
                AND sbm.salary_cost <= :max
            `
            countQuery += `
                AND sbm.salary_cost <= :max
            `
            replacements.max = max;
        }

        query += `
            LIMIT 15 OFFSET :offset
        `;
        replacements.offset = parseInt(data.offset) * 15;

        result.salaries = await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
        result.count = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
        return result;
    },
    getSalariesForExport: async () => {
        return await sequelize.query(`
            SELECT sbm.*, emp.first_name, emp.last_name, emp.father_name FROM SalaryByMonths as sbm
            LEFT JOIN Employees as emp ON emp.id = sbm.emp_id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
    }
}