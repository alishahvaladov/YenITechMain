const { Notification, User, sequelize} = require("../../db_config/models");
const { QueryTypes } = require('sequelize');

module.exports = {
    sendNotification: async () => {
        return await sequelize.query(`
            SELECT * FROM Notifications
            WHERE seen = 0
            ORDER BY seen DESC
        `, {
            logging: false,
            type: QueryTypes.SELECT
        });
    },
    updateNotificationSeen: (data, cb) => {
        Notification.update({
            seen: data.seen
        }, {
            where: {
                id: data.id
            }
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        });
    },
    getLastFourNotification: async (role) => {
        const result = {};
        result.notifications = await sequelize.query(`
            SELECT * FROM Notifications
            WHERE belongs_to_role = :role
            OR :role = 1
            ORDER BY createdAt DESC
            LIMIT 4 OFFSET 0
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                role
            }
        });

        result.unseenNotificationCount = await sequelize.query(`
            SELECT COUNT(*) as count FROM Notifications
            WHERE belongs_to_role = :role
            OR :role = 1
            AND seen = 1
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                role
            }
        });

        return result;
    },
    getAllNotifications: async ({ user_role, userId }, limit = 15, offset = 0) => {
        const result = {};

        if(!user_role) user_role = (await User.findByPk(userId)).role;

        result.notifications = await sequelize.query(`
            SELECT description, header, id, importance, seen, url, createdAt FROM Notifications
            WHERE belongs_to_role = :user_role OR belongs_to = :userId
            ORDER BY createdAt DESC
            LIMIT :limit OFFSET :offset
        `, {
            logging: false,
            type: QueryTypes.SELECT,
            replacements: {
                user_role,
                userId,
                limit,
                offset
            }
        });

        result.count = await sequelize.query(`
            SELECT COUNT(*) AS count FROM Notifications
            WHERE belongs_to_role = :user_role OR belongs_to = :userId
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                user_role,
                userId
            }
        });

        return result;
    },
    getNotificationCount: async (user_role, userId) => {
        result.count = await sequelize.query(`
          SELECT COUNT(*) AS count FROM Notifications
          WHERE belongs_to_role = :user_role OR belongs_to = :userId
        `, {
            type: QueryTypes.SELECT,
            logging: false,
            replacements: {
                user_role,
                userId
            }
        });
    }
}