const { Notification } = require('../db_config/models');

module.exports = {
    addNotification: (data, cb) => {
        Notification.create({
            header: data.header,
            description: data.description,
            created_by: data.created_by,
            belongs_to_role: data.belongs_to_role,
            seen: 0,
            belongs_to_table: data.belongs_to_table,
            url: data.url,
            importance: data.importance
        }, {
            logging: false
        }).then((res) => {
            cb(null, res);
        }).catch((err) => {
            cb(err);
        })
    }
}