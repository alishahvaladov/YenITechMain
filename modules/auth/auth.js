const socket = require('../socket/socket');

module.exports = {
    super_admin: (req, res, next) => {
        if(req.user.active_status === 0) {
            req.flash("error_msg", "Please update password");
            return res.redirect("/update-password");
        }
        if(req.isAuthenticated() && req.user.role === 1) {
            return next();
        }
        return res.redirect("/not-found");
    },
    admin: (req, res, next) => {
            // req.roleAuthenticated = false;
            if(req.user.active_status === 0) {
                req.flash("error_msg", "Please update password");
                return res.redirect("/update-password");
            }
            if(req.isAuthenticated() && req.user.role === 2 || req.isAuthenticated() && req.user.role === 1) {
                req.roleAuthenticated = true;
                return next();
            }
            next()
        //   return res.redirect("/not-found")
    },
    hr: (req, res, next) => {
        // req.roleAuthenticated = false;
        if(req.user.active_status === 0) {
            req.flash("error_msg", "Please update password");
            return res.redirect("/update-password");
        }
        if(req.isAuthenticated() && req.user.role === 5 || req.isAuthenticated() && req.user.role === 1) {
            req.roleAuthenticated = true;
            return next();
        }
        return res.redirect("/not-found");
    },
    audit: (req, res, next) => {
        // req.roleAuthenticated = false;
        if(req.user.active_status === 0) {
            req.flash("error_msg", "Please update password");
            return res.redirect("/update-password");
        }
        if(req.isAuthenticated() && req.user.role === 7 || req.isAuthenticated() && req.user.role === 1) {
            req.roleAuthenticated = true;
            return next();
        }
        next();
        // return res.redirect("/not-found");
    },
    deptDirector: (req, res, next) => {
        if(req.user.active_status === 0) {
            req.flash("error_msg", "Please update password");
            return res.redirect("/update-password");
        }
        if(req.isAuthenticated() && req.user.role === 10 || req.isAuthenticated() && req.user.role === 1) {
            req.roleAuthenticated = true;
            return next();
        } 
        return res.redirect("/not-found");
    },
    ensureActivated: (req, res, next) => {
        if(req.isAuthenticated() && req.user.active_status === 1) {
            return next();
        } else {
            req.flash("error_msg", "Please update password");
            return res.redirect("/update-password");
        }
    },
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg", "Please Log In");
        return res.redirect("/login");
    },
    forwardAuthenticated: (req, res, next) => {
        if(!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/dashboard');
    },
    checkRoles: (req, res, next) => {
        if(req.isAuthenticated() && req.roleAuthenticated === true) {
            return next();
        }
        return res.redirect("/not-found");
    }
}