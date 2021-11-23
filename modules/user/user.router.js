const { register, login, logout, userDelete, getUsers, getUser, updateUser, renderRegister, activate, mailTest} = require("./user.controller");
const express = require("express");
const router = express.Router();
const { forwardAuthenticated, ensureAuthenticated, admin, ensureActivated } = require("../auth/auth");

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
    }
});

router.get("/users", ensureActivated, admin, getUsers);

router.get("/delete/:id", ensureActivated, admin, userDelete);

router.post('/login', login);

router.get('/logout', logout);

router.get("/users/update/:id", ensureActivated, admin, getUser);
router.post("/users/update/:id", ensureActivated, admin, updateUser);

router.post('/register', ensureActivated, admin, register);
router.get('/update-password', ensureAuthenticated, activate);
router.get('/mail/test', mailTest);


module.exports = router;