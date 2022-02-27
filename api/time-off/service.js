const { sequelize, TimeOffRequest, Employee, EmployeeFileDirectory } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");
 
module.exports = {
    getEmpInfo: async (id) => {
        return await sequelize.query(`SELECT emp.first_name, emp.department, emp.project_id, emp.last_name, emp.father_name, emp.department, emp.position_id, emp.project_id, dept.name as depName, pos.name as posName, proj.name as projName FROM Employees as emp 
                                        LEFT JOIN Departments as dept ON emp.department = dept.id
                                        LEFT JOIN  Positions as pos ON emp.position_id = pos.id
                                        LEFT JOIN Projects as proj ON emp.project_id = proj.id
                                        WHERE emp.id = :id`, {
            type: QueryTypes.SELECT,
            replacements: {
                id: id
            },
            logging: false
        });
    },
    getTimeOffs: async (hr_approve) => {
        let query = `
            SELECT toff.*, emp.first_name, emp.last_name, emp.father_name FROM TimeOffRequests as toff
            LEFT JOIN Employees as emp ON toff.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
            AND emp.id IS NOT NULL
        `;
        if (hr_approve) {
            query += " AND toff.status = 1"
        }
        return await sequelize.query(query, {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    addTimeOff: (data, cb) => {
        TimeOffRequest.create({
            emp_id: data.emp,
            timeoff_type: data.timeOffType,
            timeoff_start_date: data.timeOffStartDate,
            timeoff_end_date: data.timeOffEndDate,
            timeoff_job_start_date: data.wStartDate,
            status: 0
        }, {
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        })
    },
    getDirectors: async (data) => {
        const projID = parseInt(data.projID);
        const deptID = parseInt(data.deptID);
        let result = {}
        const deptDirector = await sequelize.query(`
            SELECT emp.first_name, emp.last_name FROM Employees as emp
            LEFT JOIN DepartmentProjectDirectorRels as dpdr on emp.id = dpdr.emp_id
            WHERE dpdr.department_id = :deptID
            AND dpdr.project_id = :projID
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                projID,
                deptID
            }
        });
        const director = await sequelize.query(`
            SELECT first_name, last_name FROM Employees 
            WHERE project_id = :projID
            AND position_id = 4
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                projID
            }
        });

        result.deptDirector = deptDirector;
        result.director = director;
        return result;
    },
    getEmployeeData: (id) => {
        return sequelize.query("SELECT * FROM Employees WHERE id = :id AND deletedAt IS NULL", {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {id: id}
        });
    },
    checkIfEmpExists: (emp_id, cb) => {
        Employee.findOne({
            where: {
                id: emp_id
            },
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
           cb(err);
        });
    },
    checkIfEmpFileExists: (emp_id, cb) => {
        EmployeeFileDirectory.findOne({
            where: {
                emp_id
            },
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    addFileNames: (data, cb) => {
        EmployeeFileDirectory.create({
                emp_id: data.emp_id,
                insert_user: data.user_id,
                uploaded_files: data.files
            }, {
                logging: false
            }
        ).then((files) => {
            cb(null, files);
        }).catch((err) => {
            cb(err);
        });
    },
    updateFileNames: (data, cb) => {
        EmployeeFileDirectory.update({
            update_user: data.user_id,
            uploaded_files: data.files
        }, {
            where: {
                emp_id: data.emp_id
            },
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
           cb(err);
        });
    },
    getTimeOffApproveForHR: async (id) => {
        return await sequelize.query(`
            SELECT tor.*, efd.uploaded_files, emp.first_name, emp.last_name, emp.father_name FROM TimeOffRequests as tor
            LEFT JOIN EmployeeFileDirectories as efd on tor.emp_id = efd.emp_id
            LEFT JOIN Employees as emp on tor.emp_id = emp.id
            WHERE tor.id = :id
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                id
            }
        });
    }
}