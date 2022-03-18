const { Notification, sequelize} = require("../../db_config/models");
const { QueryTypes } = require('sequelize');

module.exports = {
    sendNotification: async () => {
        return await sequelize.query(`
            SELECT * FROM Notifications
            ORDER BY seen DESC
            LIMIT 20 OFFSET 0
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });       
    }
}