const { sequelize, Employee, EmployeeShift } = require("../../db_config/models");
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
        let empRes =  await sequelize.query(`SELECT emp.*, pos.name as posName, proj.name as projName, dept.name as deptName, efd.uploaded_files, es.* FROM Employees as emp
                                    LEFT JOIN Positions as pos ON pos.id = emp.position_id
                                    LEFT JOIN Projects as proj ON proj.id = emp.project_id
                                    LEFT JOIN Departments as dept ON dept.id = emp.department
                                    LEFT JOIN EmployeeShifts as es ON emp.id = es.emp_id
                                    LEFT JOIN EmployeeFileDirectories as efd ON emp.id = efd.emp_id
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
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))
                `
                countQuery += `
                    AND ((emp.first_name like :empName AND emp.last_name like :empName2) OR (emp.first_name like :empName AND emp.father_name like :empName2) OR (emp.last_name like :empName AND emp.father_name like :empName2))
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
        if (data.limit === "all") {
            query += `
            ORDER BY emp.id DESC
        `    
        } else {
            query += `
                ORDER BY emp.id DESC
                LIMIT :limit OFFSET 0
            `
            replacements.limit = parseInt(data.limit);
        }
        
        let result = {};
        const empData = await sequelize.query(query, { 
            logging: false,
            type: QueryTypes.SELECT,
            replacements: replacements
        });
        const count = await sequelize.query(countQuery, {
            logging: false,
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
        const limit = parseInt(data.limit);

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

        if(limit === "all") {
            query += `
            ORDER BY emp.id DESC
        `;
        } else if (limit === 10 || limit === 15 || limit === 30 || limit === 50) {
            query += `
            ORDER BY emp.id DESC
            LIMIT :limit OFFSET :offset
        `;
        } else {
            " AND 1 = 0"
        }
        replacements.offset = offset;
        replacements.limit = limit;



        return await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: replacements
        });
    },
    updateEmployee: (data, shiftData, cb) => {
        Employee.update(data, {
            where: {
                id: data.id
            },
            logging: false
        }).then(res => {
            EmployeeShift.update(shiftData, {
                where: {
                    emp_id: shiftData.emp_id
                }
            }).catch((err) => {
                return cb(err);
            });
            cb(null, res);
        }).catch(err => {
            cb(err);
        });
    },
    getUserName: async (user_id) => {
        return await sequelize.query(`
            SELECT username FROM Users
            WHERE id = :user_id;
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                user_id
            }
        });
    },
    getDeletedEmployees: async (data) => {
        const result = {};
        const replacements = {};
        let query = `
            SELECT emp.*, pos.name as posName, proj.name as projName, dept.name as deptName, es.shift_type, es.shift_start, es.shift_end
            FROM Employees as emp
            LEFT JOIN Departments as dept ON emp.department = dept.id
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            LEFT JOIN EmployeeShifts as es ON emp.id = es.emp_id
            WHERE emp.deletedAt IS NOT NULL
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM Employees as emp
            LEFT JOIN Departments as dept ON emp.department = dept.id
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            LEFT JOIN EmployeeShifts as es ON emp.id = es.emp_id
            WHERE emp.deletedAt IS NOT NULL
        `

        if (data.qName !== "" && data.qName) {
            let splittedQName = data.qName.split(" ");
            if (splittedQName.length === 1) {
                query += `
                    AND (emp.first_name like :qName OR emp.last_name like :qName OR emp.father_name like :qName)
                `
                countQuery += `
                    AND (emp.first_name like :qName OR emp.last_name like :qName OR emp.father_name like :qName)
                `
                replacements.qName = `%${splittedQName[0]}%`;
            }else if (splittedQName.length === 2) {
                query += `
                    AND ((emp.first_name like :qName AND emp.last_name like :qName2)
                    OR (emp.first_name like :qName AND emp.father_name like :qName2)
                    OR (emp.last_name like :qName AND emp.father_name like :qName2))
                `;
                countQuery += `
                    AND ((emp.first_name like :qName AND emp.last_name like :qName2)
                    OR (emp.first_name like :qName AND emp.father_name like :qName2)
                    OR (emp.last_name like :qName AND emp.father_name like :qName2))
                `;
                replacements.qName = `%${splittedQName[0]}%`;
                replacements.qName2 = `%${splittedQName[1]}%`;
            } else if (splittedQName.length > 2) {
                query += `
                    AND (emp.first_name like :qName AND emp.last_name like :qName2 AND emp.father_name like :qName3)
                `
                countQuery += `
                    AND (emp.first_name like :qName AND emp.last_name like :qName2 AND emp.father_name like :qName3)
                `
                replacements.qName = `%${splittedQName[0]}%`;
                replacements.qName2 = `%${splittedQName[1]}%`;
                replacements.qName3 = `%${splittedQName[2]}%`;
            }
        }

        if (data.qPhoneNumber !== "" && data.qPhoneNumber) {
            query += `
                AND emp.phone_number like :qPhoneNumber
            `
            countQuery += `
                AND emp.phone_number like :qPhoneNumber
            `
            replacements.qPhoneNumber = data.qPhoneNumber;
        }

        if (data.qDepartment !== "" && data.qDepartment) {
            query += `
                AND dept.name like :qDepartment
            `;
            countQuery += `
                AND dept.name like :qDepartment
            `;
            replacements.qDepartment = data.qDepartment;
        }

        if (data.qPosition !== "" && data.qPosition) {
            query += `
                AND pos.name like :qPosition
            `;
            countQuery += `
                AND pos.name like :qPosition
            `;
            replacements.qPosition = data.qPosition
        }

        if (data.qProject !== "" && data.qProject) {
            query += `
                AND proj.name like :qProject
            `;
            countQuery += `
                AND proj.name like :qProject
            `;
            replacements.qProject = data.qProject;
        }



        result.deletedEmployees = await sequelize.query(query, {
            loggin: false,
            type: QueryTypes.SELECT,
            replacements
        });
        result.deletedEmployeesCount = await sequelize.query(countQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
        return result;
    }
}