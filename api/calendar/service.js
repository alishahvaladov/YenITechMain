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
            replacements: {
                startDate: data.startDate,
                endDate: data.endDate
            }
        });
    },
    updateWorkCalendar: async (data) => {
        return await sequelize.query(`
            UPDATE WorkCalendars SET status = :status
            WHERE date = :date
        `, {
            logging: false,
            type: QueryTypes.UPDATE,
            replacements: {
                status: data.status,
                date: data.date
            }
        });
    },
    getCalendarByDate: async (date) => {
        return await sequelize.query(`
            SELECT * FROM WorkCalendars
            WHERE date = :date
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                date: date
            }
        });
    }
}