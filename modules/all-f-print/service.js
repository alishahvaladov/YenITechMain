const { sequelize } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    getAllFPrints: async (data) => {
        let query = "";
        let countQuery = "";
        let replacements = {};
        const result = {};

        //Select Query
        let fpQuery = `
            SELECT fp.id, fp.emp_id, fp.f_print_date as date, fp.f_print_time as time, emp.first_name as name, emp.last_name as surname, emp.father_name as fname,
            pos.name as posName, dept.name as deptName, proj.name as projName FROM FPrints as fp 
            LEFT JOIN Employees as emp ON fp.emp_id = emp.id
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Departments as dept ON dept.id = emp.department
            LEFT JOIN Projects as proj ON proj.id = emp.project_id
            WHERE emp.deletedAt IS NULL
        `;
        let nfpEQuery = `
            UNION
            SELECT nfp.id, nfp.emp_id, nfp.createdAt as date, nfp.enter_sign_time as time, emp.first_name as name, emp.last_name as surname, emp.father_name fname,
            pos.name as posName, dept.name as deptName, proj.name as projName FROM NoFPrints as nfp 
            LEFT JOIN Employees as emp ON nfp.emp_id = emp.id
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Departments as dept ON dept.id = emp.department
            LEFT JOIN Projects as proj ON proj.id = emp.project_id
            WHERE emp.deletedAt IS NULL
        `;
        let nfpLQuery = `
            UNION
            SELECT nfp.id, nfp.emp_id, nfp.createdAt as date, nfp.leave_sign_time as time, emp.first_name as name, emp.last_name as surname, emp.father_name as fname,
            pos.name as posName, dept.name as deptName, proj.name as projName FROM NoFPrints as nfp 
            LEFT JOIN Employees as emp ON nfp.emp_id = emp.id
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Departments as dept ON dept.id = emp.department
            LEFT JOIN Projects as proj ON proj.id = emp.project_id
            WHERE emp.deletedAt IS NULL
            AND nfp.leave_sign_time IS NOT NULL
        `;
        // Count Query
        let countStart = ("SELECT ( ");
        let fpCount = `
            (
                SELECT COUNT(*) FROM FPrints as fp 
                LEFT JOIN Employees as emp ON fp.emp_id = emp.id
                LEFT JOIN Positions as pos ON emp.position_id = pos.id
                LEFT JOIN Departments as dept ON dept.id = emp.department
                LEFT JOIN Projects as proj ON proj.id = emp.project_id
                WHERE emp.deletedAt IS NULL
        `
        let nfpECount = `
            (
                SELECT COUNT(*) FROM NoFPrints as nfp 
                LEFT JOIN Employees as emp ON nfp.emp_id = emp.id
                LEFT JOIN Positions as pos ON emp.position_id = pos.id
                LEFT JOIN Departments as dept ON dept.id = emp.department
                LEFT JOIN Projects as proj ON proj.id = emp.project_id
                WHERE emp.deletedAt IS NULL
        `
        let nfpLCount = `
            (
                SELECT COUNT(*) FROM NoFPrints as nfp 
                LEFT JOIN Employees as emp ON nfp.emp_id = emp.id
                LEFT JOIN Positions as pos ON emp.position_id = pos.id
                LEFT JOIN Departments as dept ON dept.id = emp.department
                LEFT JOIN Projects as proj ON proj.id = emp.project_id
                WHERE emp.deletedAt IS NULL
                AND nfp.leave_sign_time IS NOT NULL
        `
        let countEnd = (" ) as Count");

        if(data.qEmployee !== '') {
            console.log(data.qEmployee);
            let qEmp = data.qEmployee.split(" ");
            if(qEmp.length === 1) {
                fpQuery += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                nfpEQuery += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                nfpLQuery += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                fpCount += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)"
                nfpECount += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)"
                nfpLCount += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)"
                replacements.empName =  "%" + data.qEmployee + "%";
            } else if (qEmp.length === 2) {
                fpQuery += " AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))";
                nfpEQuery += " AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))";
                nfpLQuery += " AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))";
                fpCount += " AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))"
                nfpECount += " AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))"
                nfpLCount += " AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))"
                replacements.empName = "%" + qEmp[0] + "%";
                replacements.empName2 = "%" + qEmp[1] + "%";
            } else if(qEmp.length === 3) {
                fpQuery += " AND ((emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName) OR (emp.first_name like :empName2 OR emp.last_name like :empName2 OR emp.father_name like :empName2) OR (emp.first_name like :empName3 OR emp.last_name like :empName3 OR emp.father_name like :empName3))";
                nfpEQuery += " AND ((emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName) OR (emp.first_name like :empName2 OR emp.last_name like :empName2 OR emp.father_name like :empName2) OR (emp.first_name like :empName3 OR emp.last_name like :empName3 OR emp.father_name like :empName3))";
                nfpLQuery += " AND ((emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName) OR (emp.first_name like :empName2 OR emp.last_name like :empName2 OR emp.father_name like :empName2) OR (emp.first_name like :empName3 OR emp.last_name like :empName3 OR emp.father_name like :empName3))";
                fpCount += " AND ((emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName) OR (emp.first_name like :empName2 OR emp.last_name like :empName2 OR emp.father_name like :empName2) OR (emp.first_name like :empName3 OR emp.last_name like :empName3 OR emp.father_name like :empName3))";
                nfpECount += " AND ((emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName) OR (emp.first_name like :empName2 OR emp.last_name like :empName2 OR emp.father_name like :empName2) OR (emp.first_name like :empName3 OR emp.last_name like :empName3 OR emp.father_name like :empName3))";
                nfpLCount += " AND ((emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName) OR (emp.first_name like :empName2 OR emp.last_name like :empName2 OR emp.father_name like :empName2) OR (emp.first_name like :empName3 OR emp.last_name like :empName3 OR emp.father_name like :empName3))";
                replacements.empName = "%" + qEmp[0] + "%";
                replacements.empName2 = "%" + qEmp[1] + "%";
                replacements.empName3 = "%" + qEmp[2] + "%";
            } else if (qEmp.length > 3) {
                fpQuery += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                nfpEQuery += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                nfpLQuery += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                fpCount += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                nfpECount += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                nfpLCount += " AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)";
                replacements.empName =  "%" + data.qEmployee + "%";
            }
        }
        if(data.qProject !== '') {
            fpQuery += " AND proj.name like :projName"
            nfpEQuery += " AND proj.name like :projName"
            nfpLQuery += " AND proj.name like :projName"
            fpCount += " AND proj.name like :projName"
            nfpECount += " AND proj.name like :projName"
            nfpLCount += " AND proj.name like :projName"
            replacements.projName = "%" + data.qProject + "%";
        }
        if(data.qDepartment !== '') {
            fpQuery += " AND dept.name like :deptName"
            nfpEQuery += " AND dept.name like :deptName"
            nfpLQuery += " AND dept.name like :deptName"
            fpCount += " AND dept.name like :deptName"
            nfpECount += " AND dept.name like :deptName"
            nfpLCount += " AND dept.name like :deptName"
            replacements.deptName = "%" + data.qDepartment + "%";
        }
        if(data.qPosition !== '') {
            fpQuery += " AND pos.name like :posName"
            nfpEQuery += " AND pos.name like :posName"
            nfpLQuery += " AND pos.name like :posName"
            fpCount += " AND pos.name like :posName"
            nfpECount += " AND pos.name like :posName"
            nfpLCount += " AND pos.name like :posName"
            replacements.posName = "%" + data.qPosition + "%";
        }
        if(data.qTime !== '') {
            fpQuery += " AND fp.f_print_time like :fTime"
            nfpEQuery += " AND fp.f_print_time like :fTime"
            nfpLQuery += " AND fp.f_print_time like :fTime"
            fpCount += " AND fp.f_print_time like :fTime"
            nfpECount += " AND fp.f_print_time like :fTime"
            nfpLCount += " AND fp.f_print_time like :fTime"
            replacements.fTime = "%" + data.qTime + "%";
        }
        if(data.qDay !== '' && data.qDay !== '00' && data.qDay !== 'gun') {
            fpQuery += " AND DAY(fp.f_print_date) = :fDay"
            nfpEQuery += " AND DAY(fp.f_print_date) = :fDay"
            nfpLQuery += " AND DAY(fp.f_print_date) = :fDay"
            fpCount += " AND DAY(fp.f_print_date) = :fDay"
            nfpECount += " AND DAY(fp.f_print_date) = :fDay"
            nfpLCount += " AND DAY(fp.f_print_date) = :fDay"
            replacements.fDay = data.qDay;
            console.log(typeof data.qDay)
        }
        if (data.qMonth !== '' && data.qMonth !== "00" && data.qMonth !== 'ay') {
            fpQuery += " AND MONTH(fp.f_print_date) = :fMonth"
            nfpEQuery += " AND MONTH(fp.f_print_date) = :fMonth"
            nfpLQuery += " AND MONTH(fp.f_print_date) = :fMonth"
            fpCount += " AND MONTH(fp.f_print_date) = :fMonth"
            nfpECount += " AND MONTH(fp.f_print_date) = :fMonth"
            nfpLCount += " AND MONTH(fp.f_print_date) = :fMonth"
            replacements.fMonth = data.qMonth;
        }
        if (data.qYear !== '' && data.qYear !== "00" && data.qYear !== "il") {
            fpQuery += " AND YEAR(fp.f_print_date) = :fYear"
            nfpEQuery += " AND YEAR(fp.f_print_date) = :fYear"
            nfpLQuery += " AND YEAR(fp.f_print_date) = :fYear"
            fpCount += " AND YEAR(fp.f_print_date) = :fYear"
            nfpECount += " AND YEAR(fp.f_print_date) = :fYear"
            nfpLCount += " AND YEAR(fp.f_print_date) = :fYear"
            replacements.fYear = data.qYear;
        }

        if (data.limit === "all") {
            query += fpQuery + nfpEQuery + nfpLQuery + " ORDER BY date DESC";
        } else {
            query += fpQuery + nfpEQuery + nfpLQuery + " ORDER BY date DESC LIMIT 15 OFFSET :offset";
            replacements.offset = parseInt(data.offset);
        }
        

        countQuery += countStart + fpCount + " ) +" + nfpECount + " ) +" + nfpLCount + " )" + countEnd;

        result.fprints = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: replacements,
            logging: false
        });

        const count = await sequelize.query(countQuery, {
            type: QueryTypes.SELECT,
            replacements: replacements,
            logging: false
        });
        result.count = count[0].Count;
        return result;
    }
}