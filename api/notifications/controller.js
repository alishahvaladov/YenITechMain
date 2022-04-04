const { sendNotification } = require('./service');

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
                    new_notification: false
                });
            }
        } else {
            res.status(200).json({
                new_notification: false,
                message: "No notification found"
            });
        }
    }
}