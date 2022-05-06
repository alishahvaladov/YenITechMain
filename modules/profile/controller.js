const config = require('../../config/config.json');

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
                deptDirector: true
            });
        }
    },
    renderTimeOffRequest: (req, res) => {
        try {
            const tOffTypes = config.day_offs;
            if(req.user.role === 1) {
                res.render("profile/request-timeoff", {
                    super_admin: true,
                    tOffTypes
                });
            } else if (req.user.role === 5) {
                res.render("profile/request-timeoff", {
                    hr: true,
                    tOffTypes
                });
            } else if (req.user.role === 10) {
                res.render("profile/request-timeoff", {
                    deptDirector: true,
                    tOffTypes
                });
            }
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "Something went wrong!");
            return res.redirect('/profile');
        }
    }
}