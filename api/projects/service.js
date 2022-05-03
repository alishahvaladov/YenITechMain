const { sequelize } = require("../../db_config/models");
const { QueryTypes } = require("sequelize");

module.exports = {
    getProjects: async (offset) => {
        const result = {};

        const project = await sequelize.query(`
            SELECT pj.id, pj.name, pj.address, emp.first_name, emp.last_name, emp.father_name FROM Projects as pj
            LEFT JOIN Employees as emp ON emp.id = pj.project_manager_id
            WHERE pj.deletedAt IS NULL
            limit 15 offset :offset
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                offset
            }
        });

        const count = await sequelize.query(`
            SELECT COUNT(*) as count FROM Projects as pj
            LEFT JOIN Employees as emp ON emp.id = pj.project_manager_id
            WHERE pj.deletedAt IS NULL
        `, {
            type: QueryTypes.SELECT,
            logging: false,
        });

        result.projects = project;
        result.count = count;
        return result;
    }
}