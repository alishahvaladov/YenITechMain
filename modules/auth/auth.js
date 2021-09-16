module.exports = {
    super_admin: (req, res, next) => {
        if(req.isAuthenticated() && req.user.role === 1) {
            return next();
        }
        return res.redirect("/not-found");
    },
    admin: (req, res, next) => {
      if(req.isAuthenticated() && req.user.role === 2 || req.isAuthenticated() && req.user.role === 1) {
          return next();
      }
      console.log(req.user.role);
      return res.redirect("/not-found")
    },
    hr: (req, res, next) => {
      if(req.isAuthenticated() && req.user.role === 5 || req.isAuthenticated() && req.user.role === 1) {
          return next();
      }
      return res.redirect("/not-found");
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
        res.redirect('/dashboard');
    }
}