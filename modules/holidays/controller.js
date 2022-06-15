module.exports = {
    renderHolidayPage: (req, res) => {
        if (req.user.role === 1) {
            res.render("holidays/holidays", {
                super_admin: true
            });
        } else if (req.user.role === 5) {
            res.render("holidays/holidays", {
                hr: true
            });
        }
    }
}