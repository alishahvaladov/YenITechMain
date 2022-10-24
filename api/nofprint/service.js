const { sequelize } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");
const date = new Date();
let month = date.getMonth();
month = parseInt(month) + 1;

module.exports = {
    getNoFPrints: async (data) => {
        let countQuery = `
            SELECT COUNT(*) as count FROM NoFPrints as nfp
            LEFT JOIN Employees as emp on nfp.emp_id = emp.id
            LEFT JOIN Projects as proj on emp.project_id = proj.id
            LEFT JOIN Positions as pos on emp.position_id = pos.id
            LEFT JOIN Departments as dept on emp.department = dept.id
            WHERE (emp.deletedAt or emp.j_end_date) IS NULL
        `;
        const result = {};
        let replacements = {};
        let query = `
            SELECT nfp.*, emp.first_name as name, emp.last_name as surname, emp.father_name as fname,
            proj.name as projName, pos.name as posName, dept.name as deptName FROM NoFPrints as nfp
            LEFT JOIN Employees as emp on nfp.emp_id = emp.id
            LEFT JOIN Projects as proj on emp.project_id = proj.id
            LEFT JOIN Positions as pos on emp.position_id = pos.id
            LEFT JOIN Departments as dept on emp.department = dept.id
            WHERE (emp.deletedAt or emp.j_end_date) IS NULL
        `;
        if(data.qEmployee && data.qEmployee !== '') {
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
        if(data.qProject && data.qProject !== '') {
            query += " AND proj.name like :projName"
            countQuery += " AND proj.name like :projName"
            replacements.projName = "%" + data.qProject + "%";
        }
        if(data.qDepartment && data.qDepartment !== '') {
            query += " AND dept.name like :deptName"
            countQuery += " AND dept.name like :deptName"
            replacements.deptName = "%" + data.qDepartment + "%";
        }
        if(data.qPosition && data.qPosition !== '') {
            query += " AND pos.name like :posName"
            countQuery += " AND pos.name like :posName"
            replacements.posName = "%" + data.qPosition + "%";
        }
        if(data.qTimeEnter && data.qTimeEnter !== '') {
            query += " AND nfp.enter_sign_time like :fTimeEnter"
            countQuery += " AND nfp.enter_sign_time like :fTimeEnter"
            replacements.fTimeEnter = "%" + data.qTimeEnter + "%";
        }
        if(data.qTimeLeave && data.qTimeLeave !== '') {
            query += " AND nfp.leave_sign_time like :fTimeLeave"
            countQuery += " AND nfp.leave_sign_time like :fTimeLeave"
            replacements.fTimeLeave = "%" + data.qTimeLeave + "%";
        }
        if(data.qDate && data.qDate !== '') {
            const splittedDate = data.qDate.split("-");
            if (splittedDate.length === 3) {
                query += `
                    AND DAY(nfp.date) = :qDay
                    AND MONTH(nfp.date) = :qMonth
                    AND YEAR(nfp.date) = :qYear
                `;

                countQuery += `
                    AND DAY(nfp.date) = :qDay
                    AND MONTH(nfp.date) = :qMonth
                    AND YEAR(nfp.date) = :qYear
                `;
                replacements.qDay = splittedDate[2];
                replacements.qMonth = splittedDate[1];
                replacements.qYear = splittedDate[0];
            } else {
                const date = new Date();
                query += `
                    AND DAY(nfp.date) = :qDay
                    AND MONTH(nfp.date) = :qMonth
                    AND YEAR(nfp.date) = :qYear
                `;

                countQuery += `
                    AND DAY(nfp.date) = :qDay
                    AND MONTH(nfp.date) = :qMonth
                    AND YEAR(nfp.date) = :qYear
                `;

                replacements.qDay = date.getDate();
                replacements.qMonth = date.getMonth() + 1;
                replacements.qYear = date.getFullYear();
            }
        } else {
            const date = new Date();
            query += `
                AND DAY(nfp.date) = :qDay
                AND MONTH(nfp.date) = :qMonth
                AND YEAR(nfp.date) = :qYear
            `;

            countQuery += `
                AND DAY(nfp.date) = :qDay
                AND MONTH(nfp.date) = :qMonth
                AND YEAR(nfp.date) = :qYear
            `;

            replacements.qDay = date.getDate();
            replacements.qMonth = date.getMonth() + 1;
            replacements.qYear = date.getFullYear();
        }

        let offset = 0;

        if (data.offset && data.offset !== "" && !isNaN(parseInt(data.offset))) {
            offset = data.offset;
        }

        query += `
            LIMIT 15 OFFSET :offset
        `;

        replacements.offset = offset;
        
        result.nfprints = await sequelize.query(query, { 
            type: QueryTypes.SELECT,
            replacements: replacements,
            logging: false
        });

        result.count = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: replacements
        });

        console.log(result);
        return result;
    }
}
