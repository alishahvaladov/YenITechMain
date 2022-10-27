const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../db_config/models");

module.exports = {
    getWorkCalendars: async (data) => {
        return await sequelize.query(`
            SELECT * FROM WorkCalendars
            WHERE date >= :startDate
            AND date <= :endDate
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacments: {
                startDate: data.startDate,
                endDate: data.endDate
            }
        });
    }
}