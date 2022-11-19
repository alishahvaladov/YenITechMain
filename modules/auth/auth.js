const socket = require('../socket/socket');

module.exports = {
    super_admin: (req, res, next) => {
        if(req.user.active_status === 0) {
            req.flash("error_msg", "Please update password");
            return res.redirect("/update-password");
        }
        if(req.isAuthenticated() && req.user.role === 1) {
            req.roleAuthenticated = true;
            return next();
        }
        return next();
    },
    admin: (req, res, next) => {
            // req.roleAuthenticated = false;
            if (!req.isAuthenticated()) {
                return res.status(403).send({
                    success: false,
                    message: "Forbidden URL!"
                });
            } 
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
        if(req.isAuthenticated() && req.user.role === 5 || req.isAuthenticated() && req.user.role === 1) {
            req.roleAuthenticated = true;
            return next();
        }
        if (!req.isAuthenticated()) {
            return res.status(403).send({
                success: false,
                message: "Forbidden URL!"
            });
        } 
        if(req.user.active_status === 0) {
            req.flash("error_msg", "Please update password");
            return res.redirect("/update-password");
        }
        
        next();
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
    },
    deptDirector: (req, res, next) => {
        if(req.user.active_status === 0) {
            req.flash("error_msg", "Please update password");
            return res.redirect("/update-password");
        }
        if(req.isAuthenticated() && req.user.role === 9 || req.isAuthenticated() && req.user.role === 1) {
            req.roleAuthenticated = true;
            return next();
        }
        return next();
    },
    ensureActivated: (req, res, next) => {
        if(req.isAuthenticated() && req.user.active_status === 1) {
            req.roleAuthenticated = true;
            return next();
        } else {
            req.flash("error_msg", "Please update password");
            return res.redirect("/update-password");
        }
    },
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()) {
            req.roleAuthenticated = true;
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
    },
    checkRolesForAPI: (req, res, next) => {
        if (req.isAuthenticated() && req.roleAuthenticated === true) {
            return next();
        }
        console.log(req);
        return res.status(403).send({
            success: false,
            message: "Forbidden URL!"
        });
    }
}