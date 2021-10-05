const { sequelize } = require("../../db_config/models");
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
    }
}