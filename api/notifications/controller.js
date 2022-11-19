const { sendNotification,
    updateNotificationSeen,
    getLastFourNotification,
    getAllNotifications
} = require('./service');

module.exports = {
    sendNotification: async (req, res) => {
        const result = await sendNotification();
        let unseenNotifications = [];
        if (result.length > 0) {
            result.forEach(notification => {
                if((req.user.role === 1 || req.user.role === notification.belongs_to_role) && notification.seen === 0) {
                    unseenNotifications.push(notification);
                }
            });
            if (unseenNotifications.length > 0) {
                return res.status(200).json({
                    new_notification: true,
                    unseenNotifications
                });
            } else {
                return res.status(200).json({
                    new_notification: false,
                    message: "No notification found"
                });
            }
        } else {
            res.status(200).json({
                new_notification: false,
                message: "No notification found"
            });
        }
    },
    updateNotificationSeen: (req, res) => {
        try {
            const data = {};
            const id = req.params.id;
            const seen = parseInt(req.query.seen);
            if(!seen) {
                return res.status(400).send({
                    success: false,
                    message: "Notification update request must done only with numbers"
                });
            }
            if (seen === 1 || seen === 2) {
                data.seen = seen;
            } else {
                return res.status(400).send({
                    success: false,
                    message: "Wrong notification update request"
                });
            }
            data.id = id;
            updateNotificationSeen(data, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        success: false,
                        message: "Ups... Something went wrong!"
                    });
                }
                return res.status(200).send({
                    success: true
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getLastFourNotification: async (req, res) => {
        try {
            const role = parseInt(req.user.role);
            const result = await getLastFourNotification(role);

            return res.status(200).send({
                success: true,
                result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    },
    getAllNotifications: async (req, res) => {
        try {
            const { role: user_role, id } = req.user;
            let limit =  req.query.limit;
            let offset = req.query.offset;

            if (isNaN(parseInt(limit))) {
                return res.status(400).send({
                    success: false,
                    message: "Limit cannot be a string"
                });
            } else {
                limit = parseInt(limit);
            }

            if (isNaN(parseInt(offset))) {
                return res.status(400).send({
                    success: false,
                    message: "Offset cannot be a string"
                });
            } else {
                offset = parseInt(offset);
            }

            const result = await getAllNotifications({ user_role, userId: id }, limit, offset);
            return res.status(200).send({
                success: true,
                notifications: result.notifications,
                count: result.count
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: "Ups... Something went wrong!"
            });
        }
    }
}