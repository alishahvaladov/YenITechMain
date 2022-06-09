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
    },
    renderSalariesPage: (req, res) => {
        res.render('profile/salaries', {
            hr: true,
            super_admin: true,
            deptDirector: true
        });
    },
    renderUserTimeOffPage: (req, res) => {
        try {
            res.render('profile/time-offs', {
                hr: true,
                super_admin: true,
                deptDirector: true
            })
        } catch (err) {
            console.log(err);
            req.flash('error_msg', "Something went wrong while loading page. Please contact system admin.");
            return res.redirect('/dashboard');
        }
    },
    renderChangePassword: (req, res) => {
        try {
            if (req.user.role === 1) {
                return res.render("profile/change-password", {
                    super_admin: true
                });
            } else if (req.user.role === 5) {
                return res.render("profile/change-password", {
                    hr: true
                });
            }
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "Ups... Something went wrong!");
            return res.redirect("/dashboard");
        }
    }
}