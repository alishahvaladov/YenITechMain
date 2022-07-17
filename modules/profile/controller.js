const config = require('../../config/config.json');

module.exports = {
    renderProfilePage: async (req, res) => {
        return res.render("profile/profile");
    },
    renderTimeOffRequest: (req, res) => {
        try {
            const tOffTypes = config.day_offs;
            res.render("profile/request-timeoff", {
                tOffTypes
                });
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "Something went wrong!");
            return res.redirect('/profile');
        }
    },
    renderSalariesPage: (req, res) => {
        return res.render('profile/salaries', {
            hr: true,
            super_admin: true,
            deptDirector: true
        });
    },
    renderUserTimeOffPage: (req, res) => {
        try {
            return res.render('profile/time-offs')
        } catch (err) {
            console.log(err);
            req.flash('error_msg', "Something went wrong while loading page. Please contact system admin.");
            return res.redirect('/dashboard');
        }
    },
    renderChangePassword: (req, res) => {
        try {
                return res.render("profile/change-password");
            
        } catch (err) {
            console.log(err);
            req.flash("error_msg", "Ups... Something went wrong!");
            return res.redirect("/dashboard");
        }
    }
}