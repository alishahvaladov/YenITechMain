

module.exports = {
    renderStandardWorkingHours: (req, res) => {
        if (req.user.role === 1) {
            return res.render('working-hours/working-hours', {
                super_admin: true
            });
        } else if (req.user.role === 5) {
            return res.render('working-hours/working-hours', {
                hr: true
            });
        } else if (req.user.role === 7) {
            return res.render('working-hours/working-hours', {
                audit: true
            });
        } else if (req.user.role === 10) {
            return res.render('working-hours/working-hours', {
                deptDirector: true
            });
        }
    }
}