const { sequelize } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    getDepartment: async (id) => {
        return await sequelize.query("SELECT dept.id, dept.name FROM Departments as dept LEFT JOIN DepartmentPositions as deptpos ON deptpos.dep_id = dept.id WHERE deptpos.proj_id = :id GROUP BY dept.id", {
            replacements: { id: id },
            type: QueryTypes.SELECT
        });
    },
    getPosition: async (deptID, projID) => {
        return await sequelize.query("SELECT pos.id, pos.name FROM Positions as pos LEFT JOIN DepartmentPositions as deptpos ON deptpos.pos_id = pos.id WHERE deptpos.proj_id = :projID AND deptpos.dep_id = :deptID GROUP BY pos.id;", {
            type: QueryTypes.SELECT,
            replacements: {
                projID: projID,
                deptID, deptID
            }
        })
    },
    getEmployee: async (id) => {
        let empRes =  await sequelize.query(`SELECT emp.*, pos.name as posName, proj.name as projName, dept.name as deptName FROM Employees as emp
                                    LEFT JOIN Positions as pos ON pos.id = emp.position_id
                                    LEFT JOIN Projects as proj ON proj.id = emp.project_id
                                    LEFT JOIN Departments as dept ON dept.id = emp.department
                                    WHERE emp.id = :id`, {
           type: QueryTypes.SELECT,
           logging: false,
           replacements: {
               id: id
           }
        });
        let posRes = await sequelize.query(`SELECT * FROM Positions`, {
            logging: false,
            type: QueryTypes.SELECT
        });
        let projRes = await sequelize.query(`SELECT * FROM Projects`, {
            logging: false,
            type: QueryTypes.SELECT
        });
        let deptRes = await sequelize.query(`SELECT * FROM Departments`, {
            logging: false,
            type: QueryTypes.SELECT
        });
        let result = {};
        result.empRes = empRes;
        result.posRes = posRes;
        result.projRes = projRes; 
        result.deptRes = deptRes;

        return result;
    },
    getEmpCount: async () => {
      return await sequelize.query('SELECT COUNT(*) as empCount FROM Employees', {
          logging: false,
          type: QueryTypes.SELECT
      });
    },
    empRenderPage: async (data) => {
        const empName = data.empInpNameVal;
        const empPhone = data.empInpPhoneVal;
        const empDept = data.empDeptVal;
        const empPos = data.empPosVal;
        const empProj = data.empProjVal;
        const empStatus = data.empStatusVal;
        console.log(empName);

        let query = `
            SELECT emp.*, pos.name as posName, dept.name as deptName, proj.name as projName FROM Employees as emp
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Departments as dept ON emp.department = dept.id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            WHERE emp.deletedAt IS NULL
        `
        let countQuery = `
            SELECT COUNT(*) as count FROM Employees as emp
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Departments as dept ON emp.department = dept.id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            WHERE emp.deletedAt IS NULL
        `
        let replacements = {};

        if(empName !== '' && empName !== null) {
            const splittedName = empName.split(" ");
            if(splittedName.length === 1) {
                query += `
                    AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)
                `
                countQuery += `
                    AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)
                `
                replacements.empName = `%${splittedName[0]}%`;
            } else if (splittedName.length === 2) {
                query += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2))
                `
                countQuery += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2))
                `
                replacements.empName = `%${splittedName[0]}%`;
                replacements.empName2 = `%${splittedName[1]}%`;
            } else if (splittedName.length === 3) {
                query += `
                    AND (emp.first_name like :empName AND emp.last_name like :empName2 AND emp.father_name like :empName3)
                `
                countQuery += `
                    AND (emp.first_name like :empName AND emp.last_name like :empName2 AND emp.father_name like :empName3)
                `
                replacements.empName = `%${splittedName[0]}%`;
                replacements.empName2 = `%${splittedName[1]}%`;
                replacements.empName3 = `%${splittedName[2]}%`;
            }
        }
        if (empPhone !== '' && empPhone !== null) {
            query += " AND emp.phone_number like :phoneNumber";
            countQuery += " AND emp.phone_number like :phoneNumber";
            replacements.phoneNumber = `%${empPhone}%`;
        }
        if(empDept !== '' && empDept !== null) {
            query += " AND dept.name like :deptName";
            countQuery += " AND dept.name like :deptName";
            replacements.deptName = `%${empDept}%`;
        }
        if(empPos !== '' && empPos !== null) {
            query += " AND pos.name like :posName"
            countQuery += " AND pos.name like :posName"
            replacements.posName = `%${empPos}%`;
        }
        if(empProj !== '' && empProj !== null) {
            query += " AND proj.name like :projName";
            countQuery += " AND proj.name like :projName";
            replacements.projName = `%${empProj}%`;
        }
        if(empStatus !== '' && empStatus !== null) {
            if(parseInt(empStatus) === 1) {
                query += " AND emp.j_end_date IS NULL";
                countQuery += " AND emp.j_end_date IS NULL";
            }
            if(parseInt(empStatus) === 2) {
                query += " AND emp.j_end_date IS NOT NULL";
                countQuery += " AND emp.j_end_date IS NOT NULL";
            }
        }
        query += `
            ORDER BY emp.id DESC
            LIMIT 10 OFFSET 0
        `
        let result = {};
        const empData = await sequelize.query(query, {
            // logging: false,
            type: QueryTypes.SELECT,
            replacements: replacements
        });
        const count = await sequelize.query(countQuery, {
            // logging: false,
            type: QueryTypes.SELECT,
            replacements: replacements
        })
        result.result = empData;
        result.count = count;
        return result;
    },
    empRenderByPage: async (offset, data) => {


        const empName = data.empInpNameVal;
        const empPhone = data.empInpPhoneVal;
        const empDept = data.empDeptVal;
        const empPos = data.empPosVal;
        const empProj = data.empProjVal;
        const empStatus = data.empStatusVal;

        let query = `
            SELECT emp.*, pos.name as posName, dept.name as deptName, proj.name as projName FROM Employees as emp
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Departments as dept ON emp.department = dept.id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            WHERE emp.deletedAt IS NULL
        `
        let replacements = {};
        if(empName !== '' && empName !== null) {
            const splittedName = empName.split(" ");
            if(splittedName.length === 1) {
                query += `
                    AND (emp.first_name like :empName OR emp.last_name like :empName OR emp.father_name like :empName)
                `
                replacements.empName = `%${splittedName[0]}%`;
            } else if (splittedName.length === 2) {
                query += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2))
                `
                replacements.empName = `%${splittedName[0]}%`;
                replacements.empName2 = `%${splittedName[1]}%`;
            } else if (splittedName.length === 3) {
                query += `
                    AND (emp.first_name like :empName AND emp.last_name like :empName2 AND emp.father_name like :empName3)
                `
                replacements.empName = `%${splittedName[0]}%`;
                replacements.empName2 = `%${splittedName[1]}%`;
                replacements.empName3 = `%${splittedName[2]}%`;
            }
        }
        if (empPhone !== '' && empPhone !== null) {
            query += " AND emp.phone_number like :phoneNumber";
            replacements.phoneNumber = `%${empPhone}%`;
        }
        if(empDept !== '' && empDept !== null) {
            query += " AND dept.name like :deptName";
            replacements.deptName = `%${empDept}%`;
        }
        if(empPos !== '' && empPos !== null) {
            query += " AND pos.name like :posName"
            replacements.posName = `%${empPos}%`;
        }
        if(empProj !== '' && empProj !== null) {
            query += " AND proj.name like :projName";
            replacements.projName = `%${empProj}%`;
        }
        if(empStatus !== '' && empStatus !== null) {
            if(parseInt(empStatus) === 1) {
                query += " AND emp.j_end_date IS NULL";
            }
            if(parseInt(empStatus) === 2) {
                query += " AND emp.j_end_date IS NOT NULL";
            }
        }
        query += `
            ORDER BY emp.id DESC
            LIMIT 10 OFFSET :offset
        `;
        replacements.offset = offset;


        return await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: replacements
        });
    }
}