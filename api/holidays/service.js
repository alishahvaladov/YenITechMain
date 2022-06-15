const { QueryTypes } = require("sequelize");
const { sequelize, Holidays, HolidayDate } = require("../../db_config/models");

module.exports = {
    getHolidays: async (offset) => {
        let holidayQuery = `
            SELECT * FROM Holidays
        `;
        let holidayDateQuery = `
            SELECT hd.*, hl.name FROM HolidayDates AS hd
            LEFT JOIN Holidays AS hl ON hl.id = hd.holiday_id
            LIMIT 10 OFFSET :offset
        `;
        let holidayDateCountQuery = `
            SELECT COUNT(*) AS count FROM HolidayDates AS hd
            LEFT JOIN Holidays AS hl ON hl.id = hd.holiday_id
        `;

        const result = {};

        result.holidays = await sequelize.query(holidayQuery, {
            logging: false,
            type: QueryTypes.SELECT
        });

        result.holidayDates = await sequelize.query(holidayDateQuery, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                offset
            }
        });

        result.count = await sequelize.query(holidayDateCountQuery, {
            logging: false,
            type: QueryTypes.SELECT
        });

        return result;
    },
    addHolidayDate: (data, cb) => {
        HolidayDate.create({
            holiday_id: data.holiday_id,
            holiday_date: data.holiday_date
        }, {
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        })
    }
}