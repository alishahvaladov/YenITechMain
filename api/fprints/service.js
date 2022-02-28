const { sequelize, ForgottenFPrints, FPrint } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");
const date = new Date();
let month = date.getMonth();
month = parseInt(month) + 1;

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
        console.log(data)
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
            console.log(typeof data.qDay)
        }
        if (data.qMonth !== '' && data.qMonth !== "00" && data.qMonth !== 'ay') {
            query += " AND MONTH(fp.f_print_date) = :fMonth"
            countQuery += " AND MONTH(fp.f_print_date) = :fMonth"
            replacements.fMonth = data.qMonth;
        } else {
            query += " AND MONTH(fp.f_print_date) = :fMonth"
            countQuery += " AND MONTH(fp.f_print_date) = :fMonth"
            replacements.fMonth = month;
        }
        if (data.qYear !== '' && data.qYear !== "00" && data.qYear !== "il") {
            query += " AND YEAR(fp.f_print_date) = :fYear"
            countQuery += " AND YEAR(fp.f_print_date) = :fYear"
            replacements.fYear = data.qYear;
        }

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
    renderForgottenFPrints: async () => {
        return await sequelize.query(`
            SELECT fp.*, emp.first_name, emp.last_name, emp.father_name FROM ForgottenFPrints as fp
            LEFT JOIN Employees as emp ON emp.id = fp.emp_id
            WHERE emp.deletedAt IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
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
        FPrint.create({
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
    }
}