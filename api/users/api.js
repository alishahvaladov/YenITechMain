const { getUser, updatePassword, getAllUsers } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, admin, checkRoles } = require("../../modules/auth/auth");

router.get('/getUser/:id', admin, checkRoles, getUser);
router.post('/update-password/:id', admin, checkRoles, updatePassword);
router.get("/allUsers/:offset", admin, checkRoles, getAllUsers);

module.exports = router;