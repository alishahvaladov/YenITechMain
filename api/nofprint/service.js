const { sequelize } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    getNoFPrints: async (data) => {
        let countQuery = `
            SELECT COUNT(*) as count FROM NoFPrints as nfp
            LEFT JOIN Employees as emp on nfp.emp_id = emp.id
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
        if(data.qTimeEnter !== '') {
            query += " AND nfp.enter_sign_time like :fTimeEnter"
            countQuery += " AND nfp.enter_sign_time like :fTimeEnter"
            replacements.fTimeEnter = "%" + data.qTimeEnter + "%";
        }
        if(data.qTimeLeave !== '') {
            query += " AND nfp.leave_sign_time like :fTimeLeave"
            countQuery += " AND fp.leave_sign_time like :fTimeLeave"
            replacements.fTimeLeave = "%" + data.qTimeLeave + "%";
        }
        if(data.qDay !== '' && data.qDay !== '00' && data.qDay !== 'gun') {
            query += " AND DAY(nfp.createdAt) = :fDay"
            countQuery += " AND DAY(nfp.createdAt) = :fDay"
            replacements.fDay = data.qDay;
            console.log(typeof data.qDay)
        }
        if (data.qMonth !== '' && data.qMonth !== "00" && data.qMonth !== 'ay') {
            query += " AND MONTH(nfp.createdAt) = :fMonth"
            countQuery += " AND MONTH(nfp.createdAt) = :fMonth"
            replacements.fMonth = data.qMonth;
        }
        if (data.qYear !== '' && data.qYear !== "00" && data.qYear !== "il") {
            query += " AND YEAR(nfp.createdAt) = :fYear"
            countQuery += " AND YEAR(nfp.createdAt) = :fYear"
            replacements.fYear = data.qYear;
        }

        if (data.limit = "all") {
            query += " ORDER BY nfp.createdAt DESC"
        } else {
            query += " ORDER BY nfp.createdAt DESC LIMIT 15 OFFSET :offset"
            replacements.offset = parseInt(data.offset);    
        }
        
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
        return result;
    }
}
