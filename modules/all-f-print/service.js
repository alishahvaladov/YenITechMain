const { sequelize } = require("../../db_config/models");
const {QueryTypes} = require("sequelize");

module.exports = {
    getFPrints: async () => {
        return await sequelize.query(`SELECT * FROM FPrints`, {
            type: QueryTypes.SELECT,
            logging: false
        });
    },
    getNoFPrints: async () => {
        return await sequelize.query(`SELECT * FROM NoFPrints`, {
            type: QueryTypes.SELECT,
            logging: false
        });
    }
}