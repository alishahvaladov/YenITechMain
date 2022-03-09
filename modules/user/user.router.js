const { register,
    login,
    logout,
    userDelete,
    getUsers,
    getUser,
    updateUser,
    renderRegister,
    activate,
    activateUser,
    forgotPassword
} = require("./user.controller");
const express = require("express");
const router = express.Router();
const { forwardAuthenticated, ensureAuthenticated, admin, ensureActivated, checkRoles } = require("../auth/auth");

router.get('/register', admin, ensureActivated, renderRegister);
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login', {
        layout: 'login-layout'
    });
});
router.get("/dashboard",  ensureActivated, ensureAuthenticated, (req, res) => {
    if (req.user.role === 5) {
        res.render('dashboard', {
            hr: true
        });
    } else if (req.user.role === 1) {
        res.render('dashboard', {
            super_admin: true
        })
    } else if (req.user.role === 2) {
        res.render('dashboard', {
            hr: true
        })
    } else if (req.user.role === 10) {
        res.render('dashboard', {
            deptDirector: true
        })
    }
});
router.get("/users", admin, checkRoles, getUsers);
router.get("/delete/:id", ensureActivated, admin, userDelete);
router.post('/login', login);
router.get('/logout', logout);
router.get("/users/update/:id", admin, checkRoles, getUser);
router.post("/users/update/:id", ensureActivated, admin, checkRoles, updateUser);
router.post("/activate-user", ensureAuthenticated, activateUser);
router.post('/register', ensureActivated, admin, register);
router.get("/forgot-password", forwardAuthenticated, (req, res) => {
    return res.render("users/forgot-password", {
        layout: 'login-layout'
    });
});
router.post("/forgot-password", forwardAuthenticated, forgotPassword);
router.get('/update-password', ensureAuthenticated, activate);


module.exports = router;