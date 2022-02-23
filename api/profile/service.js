const { sequelize } = require("../../db_config/models");
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
    }
}