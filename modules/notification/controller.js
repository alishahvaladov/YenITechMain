module.exports = {
    renderAllNotifications: (req, res) => {
        if (req.user.role === 1) {
            return res.render("notification/all-notification", {
                super_admin: true
            });
        } else if (req.user.role === 5) {
            return res.render("notification/all-notification", {
                hr: true
            });
        }
    }
}