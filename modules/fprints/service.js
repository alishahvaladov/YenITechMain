const { sequelize } = require("../../db_config/models");
const { QueryTypes} = require("sequelize");

module.exports = {
    getFPrints: async () => {
        return await sequelize.query(`SELECT fp.*, emp.first_name, emp.last_name, emp.father_name, proj.name as projName, dept.name as deptName, pos.name as posName FROM Employees as emp LEFT JOIN FPrints as fp ON emp.id = fp.emp_id
                                        LEFT JOIN Projects as proj ON emp.project_id = proj.id
                                        LEFT JOIN Departments as dept ON emp.department = dept.id
                                        LEFT JOIN Positions as pos ON emp.position_id = pos.id
                                        WHERE fp.f_enter IS NOT NULL AND fp.f_leave IS NOT NULL AND emp.deletedAt IS NULL`, {
            type: QueryTypes.SELECT,
            logging: false
        });
    }
}