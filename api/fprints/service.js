const { sequelize, ForgottenFPrints, FPrintDraft } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");
const date = new Date();
let month = date.getMonth();
month = parseInt(month) + 1;
let year = date.getFullYear();
let day = date.getDate();

module.exports = {
    searchFPrint: async (data) => {
        let result = {}
        let countQuery = `SELECT COUNT(*) as count FROM FPrints as fp
                            LEFT JOIN Employees as emp ON emp.id = fp.emp_id
                            LEFT JOIN Projects as proj ON emp.project_id = proj.id
                            LEFT JOIN Departments as dept ON emp.department = dept.id
                            LEFT JOIN Positions as pos ON emp.position_id = pos.id
                            WHERE fp.f_print_time IS NOT NULL AND (emp.deletedAt OR emp.j_end_date) IS NULL`;
        let query = `SELECT fp.*, emp.first_name as name, emp.last_name as surname, emp.father_name as fname, proj.name as projName, dept.name as deptName, pos.name as posName FROM Employees as emp LEFT JOIN FPrints as fp ON emp.id = fp.emp_id
                                        LEFT JOIN Projects as proj ON emp.project_id = proj.id
                                        LEFT JOIN Departments as dept ON emp.department = dept.id
                                        LEFT JOIN Positions as pos ON emp.position_id = pos.id
                                        WHERE fp.f_print_time IS NOT NULL AND (emp.deletedAt OR emp.j_end_date) IS NULL`;
        let replacements = {};
        if(data.qEmployee !== '') {
            let qEmp = data.qEmployee.split(" ");
            if(qEmp.length === 1) {
                query += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                countQuery += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)"
                replacements.empName =  "%" + data.qEmployee + "%";
            } else if (qEmp.length === 2) {
                query += " AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))";
                countQuery += " AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))"
                replacements.empName = "%" + qEmp[0] + "%";
                replacements.empName2 = "%" + qEmp[1] + "%";
            } else if(qEmp.length === 3) {
                query += " AND ((emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName) OR (emp.first_name like :empName2 OR emp.last_name like :empName2 OR emp.father_name like :empName2) OR (emp.first_name like :empName3 OR emp.last_name like :empName3 OR emp.father_name like :empName3))";
                countQuery += " AND ((emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName) OR (emp.first_name like :empName2 OR emp.last_name like :empName2 OR emp.father_name like :empName2) OR (emp.first_name like :empName3 OR emp.last_name like :empName3 OR emp.father_name like :empName3))";
                replacements.empName = "%" + qEmp[0] + "%";
                replacements.empName2 = "%" + qEmp[1] + "%";
                replacements.empName3 = "%" + qEmp[2] + "%";
            } else if (qEmp.length > 3) {
                query += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                countQuery += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                replacements.empName =  "%" + data.qEmployee + "%";
            }
        }
        if(data.qProject !== '') {
            query += " AND proj.name like :projName"
            countQuery += " AND proj.name like :projName"
            replacements.projName = "%" + data.qProject + "%";
        }
        if(data.qDepartment !== '') {
            query += " AND dept.name like :deptName"
            countQuery += " AND dept.name like :deptName"
            replacements.deptName = "%" + data.qDepartment + "%";
        }
        if(data.qPosition !== '') {
            query += " AND pos.name like :posName"
            countQuery += " AND pos.name like :posName"
            replacements.posName = "%" + data.qPosition + "%";
        }
        if(data.qTime !== '') {
            query += " AND fp.f_print_time like :fTime"
            countQuery += " AND fp.f_print_time like :fTime"
            replacements.fTime = "%" + data.qTime + "%";
        }
        if(data.qDay !== '' && data.qDay !== '00' && data.qDay !== 'gun') {
            query += " AND DAY(fp.f_print_date) = :fDay"
            countQuery += " AND DAY(fp.f_print_date) = :fDay"
            replacements.fDay = data.qDay;
        }
        if (data.qDate !== '' && data.qDate !== "00" && data.qDate !== 'ay') {
            const splittedDate = data.qDate.split('-');
            month = splittedDate[1];
            year = splittedDate[0];
        }
        
        query += " AND MONTH(fp.f_print_date) = :fMonth"
        countQuery += " AND MONTH(fp.f_print_date) = :fMonth"
        replacements.fMonth = month;

        query += " AND YEAR(fp.f_print_date) = :fYear"
        countQuery += " AND YEAR(fp.f_print_date) = :fYear"
        replacements.fYear = year;

        if (data.limit = "all") {
            query += " ORDER BY fp.f_print_date DESC"
        } else {
            query += " ORDER BY fp.f_print_date DESC LIMIT 15 OFFSET :offset"
            replacements.offset = parseInt(data.offset);
        }
        result.fprints = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: replacements,
            logging: false
        });
        result.count = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: replacements
        });
        return result;
    },
    renderFPrints: async () => {
        let result = {};
        result.fprints = await sequelize.query(`SELECT fp.*, emp.first_name as name, emp.last_name as surname, emp.father_name as fname, proj.name as projName,
                                                pos.name as posName, dept.name as deptName
                                                FROM Employees as emp 
                                                LEFT JOIN FPrints as fp ON fp.emp_id = emp.id
                                                LEFT JOIN Projects as proj ON emp.project_id = proj.id
                                                LEFT JOIN Departments as dept ON emp.department = dept.id
                                                LEFT JOIN Positions as pos ON emp.position_id = pos.id
                                                ORDER BY createdAt DESC 
                                                LIMIT 15 OFFSET 0`, {
            logging: false,
            type: QueryTypes.SELECT
        });
        result.count = await sequelize.query(`SELECT COUNT(*) as count FROM FPrints`, {
            logging: false,
            type: QueryTypes.SELECT,
        });
        return result;
    },
    getFPrintsByPage: async (data) => {
        let query = `GET
            SELECT fp.*, emp.first_name as name, emp.last_name as surname, emp.father_name as fname, proj.name as projName,
            pos.name as posName, dept.name as deptName
            FROM Employees as emp 
            LEFT JOIN FPrints as fp ON fp.emp_id = emp.id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            LEFT JOIN Departments as dept ON emp.department = dept.id
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
        `
        let result = {};
        let offset = data.offset;
        if (data.limit === "all") {
            query += " ORDER BY createdAt DESC";
        } else {
            query += `
                ORDER BY createdAt DESC
                LIMIT :limit OFFSET :offset 
            `;
        }
        offset = 15 * (offset-1);
        result.fprints = await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                offset,
                limit: parseInt(data.limit)
            }
        });
        return result;
    },
    renderForgottenFPrints: async (offset) => {
        let result = {};
        const forgottenData = await sequelize.query(`
            SELECT fp.*, emp.first_name, emp.last_name, emp.father_name FROM ForgottenFPrints as fp
            LEFT JOIN Employees as emp ON emp.id = fp.emp_id
            WHERE emp.deletedAt IS NULL
            LIMIT 15 OFFSET :offset
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                offset
            }
        });

        const countData = await sequelize.query(`
            SELECT COUNT(*) as count FROM ForgottenFPrints as fp
            LEFT JOIN Employees as emp ON emp.id = fp.emp_id
            WHERE emp.deletedAt IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                offset
            }
        });
        result.forgottenData = forgottenData;
        result.countData = countData;

        return result;
    },
    getForgottenFPrintById: async (id) => {
        return await sequelize.query(`
            SELECT * FROM ForgottenFPrints WHERE id = :id 
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    updateForgottenFPrints: (data, cb) => {
        ForgottenFPrints.update({
            f_print_time_entrance: data.f_print_time_entrance,
            f_print_time_exit: data.f_print_time_exit 
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
    createFPrintForForgottenFPrint: (data, cb) => {
        FPrintDraft.create({
            emp_id: data.emp_id,
            user_id: data.user_id,
            f_print_date: data.f_print_date,
            f_print_time: data.f_print_time
        }, {
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        })
    },
    getFPrintsForDeptDirectors: async (data) => {
        let query = `
            SELECT fp.*, emp.first_name, emp.last_name, emp.father_name, pos.name AS posName, proj.name AS projName, dept.name as deptName FROM FPrints as fp
            LEFT JOIN Employees AS emp ON emp.id = fp.emp_id
            LEFT JOIN Positions AS pos ON pos.id = emp.position_id
            LEFT JOIN Projects AS proj ON proj.id = emp.project_id
            LEFT JOIN Departments AS dept on dept.id = emp.department
            LEFT JOIN Users AS usr ON usr.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            AND emp.department = (
                SELECT emp.department FROM Users AS usr
                LEFT JOIN Employees AS emp ON emp.id = usr.emp_id
                WHERE emp.deletedAt IS NULL
                AND usr.id = :user_id
            )
            AND emp.project_id = (
                SELECT emp.project_id FROM Users AS usr
                LEFT JOIN Employees AS emp ON emp.id = usr.emp_id
                WHERE emp.deletedAt IS NULL
                AND usr.id = :user_id
            )
        `;
        let countQuery = `
            SELECT COUNT(*) AS count FROM FPrints as fp
            LEFT JOIN Employees AS emp ON emp.id = fp.emp_id
            LEFT JOIN Positions AS pos ON pos.id = emp.position_id
            LEFT JOIN Projects AS proj ON proj.id = emp.project_id
            LEFT JOIN Departments AS dept on dept.id = emp.department
            LEFT JOIN Users AS usr ON usr.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
            AND emp.department = (
                SELECT emp.department FROM Users AS usr
                LEFT JOIN Employees AS emp ON emp.id = usr.emp_id
                WHERE emp.deletedAt IS NULL
                AND usr.id = :user_id
            )
            AND emp.project_id = (
                SELECT emp.project_id FROM Users AS usr
                LEFT JOIN Employees AS emp ON emp.id = usr.emp_id
                WHERE emp.deletedAt IS NULL
                AND usr.id = :user_id
            )
        `;

        const replacements = {};
        replacements.user_id = data.user_id;

        const result = {};

        if (data.qEmployee !== "" && data.qEmployee) {
            let splittedEmployee = data.qEmployee.split(" ");
            if (splittedEmployee.length === 1) {
                query += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee);
                `;
                countQuery += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee);
                `;
                replacements.qEmployee = `%${splittedEmployee[0]}%`;
            }
            if (splittedEmployee.length === 2) {
                query += `
                    AND ((emp.first_name like :qEmployee OR emp.last_name like :qEmployee1) OR (emp.first_name like :qEmployee OR emp.father_name like :qEmployee1) OR (emp.last_name like :qEmployee OR emp.father_name like :qEmployee1));
                `;
                countQuery += `
                    AND ((emp.first_name like :qEmployee OR emp.last_name like :qEmployee1) OR (emp.first_name like :qEmployee OR emp.father_name like :qEmployee1) OR (emp.last_name like :qEmployee OR emp.father_name like :qEmployee1));
                `;
                replacements.qEmployee = `%${splittedEmployee[0]}%`;
                replacements.qEmployee1 = `%${splittedEmployee[1]}%`;
            }
            if (splittedEmployee.length === 3) {
                query += `
                    AND (emp.fisrt_name like :qEmployee AND emp.last_name like :qEmployee1 AND emp.father_name like :qEmployee2)
                `;
                countQuery += `
                    AND (emp.fisrt_name like :qEmployee AND emp.last_name like :qEmployee1 AND emp.father_name like :qEmployee2)
                `;
                replacements.qEmployee = `%${splittedEmployee[0]}%`;
                replacements.qEmployee1 = `%${splittedEmployee[1]}%`;
                replacements.qEmployee2 = `%${splittedEmployee[2]}%`;
            }
        }

        if (data.qProject !== "" && data.qProject) {
            query += `
                AND proj.name like :qProject
            `;
            countQuery += `
                AND proj.name like :qProject
            `;
            replacements.qProject = `%${data.qProject}%`;
        }

        if (data.qDepartment !== "" && data.qDepartment) {
            query += `
                AND dept.name like :qDepartment
            `;
            countQuery += `
                AND dept.name like :qDepartment
            `;
            replacements.qDepartment = `%${data.qDepartment}%`;
        }

        if (data.qPosition !== "" && data.qPosition) {
            query += `
                AND pos.name like :qPosition
            `;
            countQuery += `
                AND pos.name like :qPosition
            `;
            replacements.qPosition = `%${data.qPosition}%`;
        }
        if (data.qTime !== "" && data.qTime) {
            query += `
                AND fp.f_print_time like :qTime
            `;
            countQuery += `
                AND fp.f_print_time like :qTime
            `;
            replacements.qTime = data.qTime;
        }
        if (data.qDate !== "" && data.qDate) {
            query += `
                AND fp.f_print_date like :qDate
            `;
            countQuery += `
                AND fp.f_print_date like :qDate
            `;
            replacements.qDate = `%${data.qDate}%`;
        }

        query += `
            LIMIT :limit OFFSET :offset
        `;
        replacements.limit = data.limit;
        replacements.offset = data.offset;

        result.fprints = await sequelize.query(query, {
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
    getActiveFPrints: async (data) => {
        let query = `
            SELECT fp.*, emp.first_name, emp.last_name, emp.father_name, pos.name AS posName, dept.name AS deptName, proj.name AS projName FROM FPrints AS fp
            LEFT JOIN Employees AS emp ON fp.emp_id = emp.id
            LEFT JOIN Positions AS pos ON pos.id = emp.position_id
            LEFT JOIN Departments AS dept ON dept.id = emp.department
            LEFT JOIN Projects AS proj ON proj.id = emp.project_id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `;
        let countQuery = `
            SELECT COUNT(*) FROM FPrints AS fp
            LEFT JOIN Employees AS emp ON fp.emp_id = emp.id
            LEFT JOIN Positions AS pos ON pos.id = emp.position_id
            LEFT JOIN Departments AS dept ON dept.id = emp.department
            LEFT JOIN Projects AS proj ON proj.id = emp.project_id
            WHERE emp.deletedAt IS NULL
            AND emp.j_end_date IS NULL
        `;
        const replacements = {};

        if(data.qEmployee !== '' && data.qEmployee) {
            let qEmp = data.qEmployee.split(" ");
            if(qEmp.length === 1) {
                query += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                countQuery += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)"
                replacements.empName =  "%" + data.qEmployee + "%";
            } else if (qEmp.length === 2) {
                query += " AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))";
                countQuery += " AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))"
                replacements.empName = "%" + qEmp[0] + "%";
                replacements.empName2 = "%" + qEmp[1] + "%";
            } else if(qEmp.length === 3) {
                query += " AND ((emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName) OR (emp.first_name like :empName2 OR emp.last_name like :empName2 OR emp.father_name like :empName2) OR (emp.first_name like :empName3 OR emp.last_name like :empName3 OR emp.father_name like :empName3))";
                countQuery += " AND ((emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName) OR (emp.first_name like :empName2 OR emp.last_name like :empName2 OR emp.father_name like :empName2) OR (emp.first_name like :empName3 OR emp.last_name like :empName3 OR emp.father_name like :empName3))";
                replacements.empName = "%" + qEmp[0] + "%";
                replacements.empName2 = "%" + qEmp[1] + "%";
                replacements.empName3 = "%" + qEmp[2] + "%";
            } else if (qEmp.length > 3) {
                query += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                countQuery += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                replacements.empName =  "%" + data.qEmployee + "%";
            }
        }

        if (data.qProject !== "" && data.qProject) {
            query += `
                AND poj.name like :qProject
            `;
            countQuery += `
                AND poj.name like :qProject
            `;
            replacements.qProject = `%${data.qProject}%`;
        }

        if (data.qDepartment !== "" && data.qDepartment) {
            query += `
                AND dept.name like :qDepartment
            `;
            countQuery += `
                AND dept.name like :qDepartment
            `;
            replacements.qDepartment = `%${data.qDepartment}%`;
        }
        
        if (data.qPosition !== "" && data.qPosition) {
            query += `
                AND pos.name like :qPosition
            `;
            countQuery += `
                AND pos.name like :qPosition
            `;
            replacements.qPosition = `%${data.qPosition}%`;
        }
        
        if (data.qMin && data.qMin !== "") {
            query += `
                AND fp.f_print_time > :qMin
            `;
            countQuery += `
                AND fp.f_print_time > :qMin
            `;
            replacements.qMin = data.qMin;
        }

        if (data.qMax && data.qMax !== "") {
            query += `
                AND fp.f_print_time > :qMax
            `;
            countQuery += `
                AND fp.f_print_time > :qMax
            `;
            replacements.qMax = data.qMax;
        }

        if (data.qDate && data.qDate !== "") {
            let splittedDate = data.qDate.split("-");
            day = splittedDate[2];
            month = splittedDate[1];
            year = splittedDate[0];
        }

        query += `
            AND DAY(fp.f_print_date) = :day
        `;
        countQuery += `
            AND DAY(fp.f_print_date) = :day
        `;
        replacements.day = day;

        query += `
            AND MONTH(fp.f_print_date) = :month
        `;
        countQuery += `
            AND MONTH(fp.f_print_date) = :month
        `;
        replacements.month = month;

        query += `
            AND YEAR(fp.f_print_date) = :year
        `;
        countQuery += `
            AND YEAR(fp.f_print_date) = :year
        `;
        replacements.year = year;

        let offset = 0;

        if (data.offset && data.offset !== "") {
            offset = parseInt(data.offset) * 15;
        }

        query += `
            ORDER BY fp.f_print_date DESC
            LIMIT 15 OFFSET :offset
        `;

        replacements.offset = offset;
        
        const fPrints = await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });

        const count = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });

        const result = {};

        result.fPrints = fPrints;
        result.count = count;

        return result;
    }
}

