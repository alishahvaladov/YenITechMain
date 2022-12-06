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
    forgotPassword,
    renderDeletedUsers
} = require("./user.controller");
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, checkGroupAndRoles, forwardAuthenticated, ensureActivated } = require("../auth/auth");


router.get('/', (req, res) => {
    return res.redirect("/login");
});
router.get('/register', ensureAuthenticated, checkGroupAndRoles("User_create", true), renderRegister);
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login', {
        layout: 'login-layout'
    });
});
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    return res.render('dashboard');
});
router.get("/users", ensureAuthenticated, checkGroupAndRoles("User_read", true), getUsers);
router.get("/delete/:id", ensureAuthenticated, checkGroupAndRoles("User_delete", true), userDelete);
router.post('/login', login);
router.get('/logout', logout);
router.get("/users/update/:id", ensureAuthenticated, checkGroupAndRoles("User_update", true), getUser);
router.post("/users/update/:id", ensureAuthenticated, checkGroupAndRoles("User_update", true), updateUser);
router.post("/activate-user", ensureAuthenticated, activateUser);
router.post('/register', ensureActivated, ensureAuthenticated, checkGroupAndRoles("User_create", true), register);
router.get("/forgot-password", forwardAuthenticated, (req, res) => {
    return res.render("users/forgot-password", {
        layout: 'login-layout'
    });
});
router.post("/forgot-password", forwardAuthenticated, forgotPassword);
router.get('/users/deleted-users', ensureAuthenticated, checkGroupAndRoles("User_delete", true), renderDeletedUsers);


module.exports = router;