const { register, login, logout, userDelete, getUsers, getUser, updateUser, renderRegister} = require("./user.controller");
const express = require("express");
const router = express.Router();
const { forwardAuthenticated, ensureAuthenticated, admin } = require("../auth/auth");

router.get('/register', admin, renderRegister);
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login', {
        layout: 'login-layout'
    });
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
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

router.get("/users", admin, getUsers);

router.get("/delete/:id", admin, userDelete);

router.post('/login', login);

router.get('/logout', logout);

router.get("/users/update/:id", admin, getUser);
router.post("/users/update/:id", admin, updateUser);

router.post('/register', admin, register);


module.exports = router;