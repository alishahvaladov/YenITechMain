const { getUser, updatePassword, getAllUsers, getDeletedUsers } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, admin, checkRoles, audit } = require("../../modules/auth/auth");

router.get('/getUser/:id', admin, checkRoles, getUser);
router.post('/update-password/:id', admin, checkRoles, updatePassword);
router.get("/allUsers/:offset", admin, checkRoles, getAllUsers);
router.post("/deleted-users", admin, audit, checkRoles, getDeletedUsers);

module.exports = router;