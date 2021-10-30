const { sequelize } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    searchFPrint: async (data) => {
        let query = `SELECT fp.*, emp.first_name, emp.last_name, emp.father_name, proj.name as projName, dept.name as deptName, pos.name as posName FROM Employees as emp LEFT JOIN FPrints as fp ON emp.id = fp.emp_id
                                        LEFT JOIN Projects as proj ON emp.project_id = proj.id
                                        LEFT JOIN Departments as dept ON emp.department = dept.id
                                        LEFT JOIN Positions as pos ON emp.position_id = pos.id
                                        WHERE fp.f_print_time IS NOT NULL AND emp.deletedAt IS NULL`;

        let replacements = {};

        if(data.qEmployee !== '') {
            let qEmp = data.qEmployee.split(" ");
            if(qEmp.length === 1) {
                query += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                replacements.empName =  "%" + data.qEmployee + "%";
            } else if (qEmp.length === 2) {
                query += " AND ((emp.first_name like :empName OR emp.father_name like :empName) AND (emp.last_name like :empName2 OR emp.father_name like :empName2))";
                replacements.empName = "%" + qEmp[0] + "%";
                replacements.empName2 = "%" + qEmp[1] + "%";
            } else if(qEmp.length === 3) {
                query += " AND ((emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName) OR (emp.first_name like :empName2 OR emp.last_name like :empName2 OR emp.father_name like :empName2) OR (emp.first_name like :empName3 OR emp.last_name like :empName3 OR emp.father_name like :empName3))";
                replacements.empName = "%" + qEmp[0] + "%";
                replacements.empName2 = "%" + qEmp[1] + "%";
                replacements.empName3 = "%" + qEmp[2] + "%";
            } else if (qEmp.length > 3) {
                query += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                replacements.empName =  "%" + data.qEmployee + "%";
            }
        }
        if(data.qProject !== '') {
            query += " AND proj.name like :projName"
            replacements.projName = "%" + data.qProject + "%";
        }
        if(data.qDepartment !== '') {
            query += " AND dept.name like :deptName"
            replacements.deptName = "%" + data.qDepartment + "%";
        }
        if(data.qPosition !== '') {
            query += " AND pos.name like :posName"
            replacements.posName = "%" + data.qPosition + "%";
        }
        if(data.qTime !== '') {
            query += " AND fp.f_print_time like :fTime"
            replacements.fTime = "%" + data.qTime + "%";
        }
        if(data.qDay !== '' && data.qDay !== '00' && data.qDay !== 'gun') {
            query += " AND DAY(fp.createdAt) = :fDay"
            replacements.fDay = data.qDay;
            console.log(typeof data.qDay)
        }
        if (data.qMonth !== '' && data.qMonth !== "00" && data.qMonth !== 'ay') {
            query += " AND MONTH(fp.createdAt) = :fMonth"
            replacements.fMonth = data.qMonth;
        }
        if (data.qYear !== '' && data.qYear !== "00" && data.qYear !== "il") {
            query += " AND YEAR(fp.createdAt) = :fYear"
            replacements.fYear = data.qYear;
        }
        console.log(query);
        console.log(replacements);

        return await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: replacements,
            logging: false
        });
    },
}