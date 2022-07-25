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
    getTimeOffs: async (hr_approve, director_approve, directorProject = null, offset, body) => {
        const result = {};
        const replacements = {};

        let query = `
            SELECT toff.*, emp.first_name, emp.last_name, emp.father_name FROM TimeOffRequests as toff
            LEFT JOIN Employees as emp ON toff.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
            AND emp.id IS NOT NULL
        `;
        let countQuery = `
            SELECT COUNT(*) as count FROM TimeOffRequests as toff
            LEFT JOIN Employees as emp ON toff.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
            AND emp.id IS NOT NULL
        `
        if (hr_approve) {
            query += " AND toff.status = 1"
            countQuery += " AND toff.status = 1"
        } else if (director_approve) {
            query += " AND toff.status = 2"
            countQuery += " AND toff.status = 2"
        }

        if(directorProject !== null) {
            query += " AND emp.project_id = :directorProject"
            countQuery += " AND emp.project_id = :directorProject"        
            replacements.directorProject = directorProject;
        }

        if (body.qEmployee && body.qEmployee !== "") {
            const splittedEmp = body.qEmployee.split(" ");
            if (splittedEmp.length === 1) {
                query += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee)
                `;
                countQuery += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
            }
            if (splittedEmp.length === 2) {
                query += `
                    AND ((emp.first_name like :qEmployee AND emp.last_name like :qEmployee2) OR (emp.first_name like :qEmployee AND emp.father_name like :qEmployee2) OR (emp.last_name like :qEmployee AND emp.father_name like :qEmployee2))
                `;
                countQuery += `
                    AND ((emp.first_name like :qEmployee AND emp.last_name like :qEmployee2) OR (emp.first_name like :qEmployee AND emp.father_name like :qEmployee2) OR (emp.last_name like :qEmployee AND emp.father_name like :qEmployee2))
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
            }
            if (splittedEmp.length === 3) {
                query += `
                    AND (emp.first_name like :qEmployee AND emp.last_name like :qEmployee2 AND emp.father_name like :qEmployee3)
                `;
                countQuery += `
                    AND (emp.first_name like :qEmployee AND emp.last_name like :qEmployee2 AND emp.father_name like :qEmployee3)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
                replacements.qEmployee3 = `%${splittedEmp[2]}%`;
            }
        }

        if (body.qType && body.qType !== "") {
            query += `
                AND toff.timeoff_type = :qType
            `;
            countQuery += `
                AND toff.timeoff_type = :qType
            `;
            replacements.qType = body.qType;
        }
        
        if (body.qStartDate && body.qStartDate !== "") {
            query += `
                AND toff.timeoff_start_date >= :qStartDate
                AND toff.timeoff_end_date >= :qStartDate
            `;
            countQuery += `
                AND toff.timeoff_start_date >= :qStartDate
                AND toff.timeoff_end_date >= :qStartDate
            `;
            replacements.qStartDate = body.qStartDate
        }
        
        if (body.qEndDate && body.qEndDate !== "") {
            query += `
                AND toff.timeoff_end_date <= :qEndDate
                AND toff.timeoff_start_date <= :qEndDate
            `;
            countQuery += `
                AND toff.timeoff_end_date <= :qEndDate
                AND toff.timeoff_start_date <= :qEndDate
            `;
            replacements.qEndDate = body.qEndDate
        }
        
        if (body.qJStartDate && body.qJStartDate !== "") {
            query += `
                AND toff.timeoff_job_start_date = :qJStartDate
            `;
            countQuery += `
                AND toff.timeoff_job_start_date = :qJStartDate
            `;
            replacements.qJStartDate = body.qJStartDate;
        }

        if (body.qStatus && body.qStatus !== "") {
            query += `
                AND toff.status = :qStatus
            `;
            countQuery += `
                AND toff.status = :qStatus
            `;
            replacements.qStatus = body.qStatus;
        }

        query += `
            AND (toff.timeoff_start_date < toff.timeoff_end_date AND toff.timeoff_start_date < toff.timeoff_job_start_date AND toff.timeoff_end_date <= toff.timeoff_job_start_date)
        `;
        countQuery += `
            AND (toff.timeoff_start_date < toff.timeoff_end_date AND toff.timeoff_start_date < toff.timeoff_job_start_date AND toff.timeoff_end_date <= toff.timeoff_job_start_date)
        `;

        query += `
            ORDER BY toff.created_at DESC
            LIMIT 15 OFFSET :offset
        `;
        replacements.offset = offset;

        result.timeoffs = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements
        });

        result.count = await sequelize.query(countQuery, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements
        });

        return result;
    },
    getTimeOffByID: async (id) => {
        return await sequelize.query(`
            SELECT tor.*, emp.first_name, emp.last_name, emp.father_name, emp.sex, emp.project_id, emp.department, pos.name as posName, proj.name as projName, dept.name as deptName, proj.address as projAddress FROM TimeOffRequests as tor
            LEFT JOIN Employees as emp ON emp.id = tor.emp_id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Departments as dept ON emp.department = dept.id
            WHERE tor.id = :id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    addTimeOff: (data, cb) => {
        TimeOffRequest.create({
            emp_id: data.emp,
            user_id: data.user_id,
            timeoff_type: data.timeOffType,
            timeoff_start_date: data.timeOffStartDate,
            timeoff_end_date: data.timeOffEndDate,
            timeoff_job_start_date: data.wStartDate,
            timoff_time: data.toffTime,
            timoff_time_date: data.toffTimeDate,
            status: 1
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
            AND tor.status = 1
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                id
            }
        });
    },
    getTimeOffApproveForDR: async (id) => {
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
    },
    cancelRequestByHr: (id, cb) => {
        TimeOffRequest.update({
            status: 7
        }, {
            where: {
                id: id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    cancelRequestByDR: (id, cb) => {
        TimeOffRequest.update({
            status: 7
        }, {
            where: {
                id: id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    approveRequestByHr: (id, cb) => {
        TimeOffRequest.update({
            status: 2
        }, {
            where: {
                id: id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    approveRequestByDR: (id, cb) => {
        TimeOffRequest.update({
            status: 3
        }, {
            where: {
                id: id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    getEmployeeByUserID: async (id) => {
        return await sequelize.query(`
            SELECT dpdr.project_id FROM Users as usr
            LEFT JOIN Employees as emp ON usr.emp_id = emp.id
            LEFT JOIN DepartmentProjectDirectorRels as dpdr ON dpdr.emp_id = usr.emp_id
            WHERE emp.deletedAt IS NULL
            AND usr.id = :id
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                id
            }
        })
    },
    approveTimeOffRequest: (id, cb) => {
        TimeOffRequest.update({
            status: 4
        }, {
            where: {
                id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    getDirectorDepartment: async (user_id) => {
        return await sequelize.query(`
            SELECT emp.department FROM Employees as emp
            LEFT JOIN Users as usr ON usr.emp_id = emp.id
            WHERE usr.id = :user_id
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                user_id
            }
        });
    },
    getTimeOffsForDirector: async (department, dr_approve, offset) => {
        const result = {};
        let timeOffQuery = `
            SELECT tor.*, emp.first_name, emp.last_name, emp.father_name FROM TimeOffRequests as tor
            LEFT JOIN Employees as emp ON emp.id = tor.emp_id
            WHERE emp.department = :department
            AND emp.deletedAt IS NULL
        `;

        if (dr_approve) {
            timeOffQuery += ` AND tor.status = 2`;
        }

        timeOffQuery += `
            ORDER BY (tor.status <> 0) DESC, tor.status
            LIMIT 15 OFFSET :offset
        `;

        result.timeoffs = await sequelize.query(timeOffQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                department,
                offset
            }
        });

        result.count = await sequelize.query(`
            SELECT COUNT(*) as count FROM TimeOffRequests as tor
            LEFT JOIN Employees as emp ON emp.id = tor.emp_id
            WHERE emp.department = :department
            AND emp.deletedAt IS NULL
        `, {
            loggging: false,
            type: QueryTypes.SELECT,
            replacements: {
                department
            }
        });

        return result;
    },
    getTimeOffsForExport: async (body) => {
        const replacements = {};

        let query = `
            SELECT toff.*, emp.first_name, emp.last_name, emp.father_name FROM TimeOffRequests as toff
            LEFT JOIN Employees as emp ON toff.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
            AND emp.id IS NOT NULL
        `;

        if (body.qEmployee && body.qEmployee !== "") {
            const splittedEmp = body.qEmployee.split(" ");
            if (splittedEmp.length === 1) {
                query += `
                    AND (emp.first_name like :qEmployee OR emp.last_name like :qEmployee OR emp.father_name like :qEmployee)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
            }
            if (splittedEmp.length === 2) {
                query += `
                    AND ((emp.first_name like :qEmployee AND emp.last_name like :qEmployee2) OR (emp.first_name like :qEmployee AND emp.father_name like :qEmployee2) OR (emp.last_name like :qEmployee AND emp.father_name like :qEmployee2))
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
            }
            if (splittedEmp.length === 3) {
                query += `
                    AND (emp.first_name like :qEmployee AND emp.last_name like :qEmployee2 AND emp.father_name like :qEmployee3)
                `;
                replacements.qEmployee = `%${splittedEmp[0]}%`;
                replacements.qEmployee2 = `%${splittedEmp[1]}%`;
                replacements.qEmployee3 = `%${splittedEmp[2]}%`;
            }
        }

        if (body.qType && body.qType !== "") {
            query += `
                AND toff.timeoff_type = :qType
            `;
            replacements.qType = body.qType;
        }
        
        if (body.qStartDate && body.qStartDate !== "") {
            query += `
                AND toff.timeoff_start_date >= :qStartDate
                AND toff.timeoff_end_date >= :qStartDate
            `;
            replacements.qStartDate = body.qStartDate
        }
        
        if (body.qEndDate && body.qEndDate !== "") {
            query += `
                AND toff.timeoff_end_date <= :qEndDate
                AND toff.timeoff_start_date <= :qEndDate
            `;
            replacements.qEndDate = body.qEndDate
        }
        
        if (body.qJStartDate && body.qJStartDate !== "") {
            query += `
                AND toff.timeoff_job_start_date = :qJStartDate
            `;
            replacements.qJStartDate = body.qJStartDate;
        }

        if (body.qStatus && body.qStatus !== "") {
            query += `
                AND toff.status = :qStatus
            `;
            replacements.qStatus = body.qStatus;
        }

        query += `
            AND (toff.timeoff_start_date < toff.timeoff_end_date AND toff.timeoff_start_date < toff.timeoff_job_start_date AND toff.timeoff_end_date <= toff.timeoff_job_start_date)
        `;

        return await sequelize.query(query, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements
        });
    }
}