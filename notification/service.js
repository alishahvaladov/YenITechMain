const { Notification } = require("../db_config/models");

module.exports = {
  addNotification: (data, cb) => {
    Notification.bulkCreate(data)
      .then((res) => cb(null, res))
      .catch((err) => cb(err, null));
  },
};
