const { sequelize, TimeOffRequest } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    renderProfile: async (id) => {
        return await sequelize.query(`
            SELECT usr.username, usr.email, emp.*, pos.name as posName, proj.name as projName, dept.name as deptName FROM Users as usr
            LEFT JOIN Employees as emp ON usr.emp_id = emp.id
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            LEFT JOIN Departments as dept ON emp.department = dept.id
            WHERE usr.id = :id
            AND (emp.deletedAt IS NULL OR usr.deletedAt IS NULL)
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                id
            }
        })
    },
    getProfilePicture: async (id) => {
        return await sequelize.query(`
            SELECT emp.id, emp.first_name, emp.last_name, emp.father_name, efd.uploaded_files FROM Employees as emp
            LEFT JOIN Users as usr ON emp.id = usr.emp_id
            LEFT JOIN EmployeeFileDirectories as efd ON emp.id = efd.emp_id
            WHERE emp.deletedAt IS NULL
            AND usr.id = :id 
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        });
    },
    getUserDataAsEmployee: async (user_id) => {
        return await sequelize.query(`
            SELECT emp.id, emp.first_name, emp.last_name, emp.father_name, dept.name as deptName, proj.name as projName, pos.name as posName 
            FROM Users as usr
            LEFT JOIN Employees as emp ON emp.id = usr.emp_id
            LEFT JOIN Departments as dept ON emp.department = dept.id
            LEFT JOIN Projects as proj ON emp.project_id = proj.id
            LEFT JOIN Positions as pos ON emp.position_id = pos.id
            WHERE usr.id = :user_id
            AND emp.deletedAt IS NULL
            AND usr.deletedAt IS NULL
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                user_id
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
    }
} 