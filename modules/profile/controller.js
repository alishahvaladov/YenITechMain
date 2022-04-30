module.exports = {
    renderProfilePage: async (req, res) => {
        if(req.user.role === 1) {
            res.render("profile/profile", {
                super_admin: true
            });
        } else if (req.user.role === 5) {
            res.render("profile/profile", {
                hr: true
            });
        } else if (req.user.role === 10) {
            res.render("profile/profile", {
                hr: true
            });
        }
    }
}