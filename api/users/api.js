const { getUser, updatePassword, getAllUsers, getDeletedUsers, exportDataToExcel, getUserRoles, updateUserGroup, removeUserGroup, getUserGroup } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, admin, checkRoles, audit, checkRolesForAPI, super_admin } = require("../../modules/auth/auth");

router.get('/getUser/:id', admin, checkRolesForAPI, getUser);
router.post('/update-password/:id', admin, checkRolesForAPI, updatePassword);
router.post("/allUsers/:offset", admin, checkRolesForAPI, getAllUsers);
router.post("/deleted-users", admin, audit, checkRolesForAPI, getDeletedUsers);
router.post('/export-to-excel', admin, audit, checkRolesForAPI, exportDataToExcel);
router.post('/get-roles', admin, checkRolesForAPI, getUserRoles);
router.post('/add-group', updateUserGroup);
router.post('/remove-group', removeUserGroup);
router.get('/get-groups/:id', getUserGroup);

module.exports = router;