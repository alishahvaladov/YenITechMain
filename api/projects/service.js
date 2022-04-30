const { sequelize } = require("../../db_config/models");
const { QueryTypes } = require("sequelize");

module.exports = {
    getProjects: async () => {
        return await sequelize.query(`
            SELECT pj.* FROM Projects as pj
            WHERE pj.deletedAt IS NULL
        `, {
            type: QueryTypes.SELECT,
            logging: false
        });
    }
}