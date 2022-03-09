const { getUser, updatePassword } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, admin, checkRoles } = require("../../modules/auth/auth");

router.get('/getUser/:id', admin, checkRoles, getUser);
router.post('/update-password/:id', admin, checkRoles, updatePassword);

module.exports = router;