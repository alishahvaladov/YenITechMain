const { sequelize, TimeOffRequest } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    getEmpInfo: async (id) => {
        return await sequelize.query(`SELECT emp.department, emp.position_id, emp.project_id, dept.name as depName, pos.name as posName, proj.name as projName FROM Employees as emp 
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
    getTimeOffs: async () => {
        return await sequelize.query(`
            SELECT toff.*, emp.first_name, emp.last_name, emp.father_name FROM TimeOffRequests as toff
            LEFT JOIN Employees as emp ON toff.emp_id = emp.id
            WHERE emp.deletedAt IS NULL
            AND emp.id IS NOT NULL
        `, {
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
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        })
    }
}