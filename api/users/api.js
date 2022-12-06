const { getUser, updatePassword, getAllUsers, getDeletedUsers, exportDataToExcel, getUserRoles, updateUserGroup, removeUserGroup, getUserGroup, getNonExistingUsers } = require("./controller");
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, checkGroupAndRoles } = require("../../modules/auth/auth");

router.get('/getUser/:id', ensureAuthenticated, checkGroupAndRoles("User_read"), getUser);
router.post('/update-password/:id', ensureAuthenticated, checkGroupAndRoles("User_update"), updatePassword);
router.post("/allUsers/:offset", ensureAuthenticated, checkGroupAndRoles("User_read"), getAllUsers);
router.post("/deleted-users", ensureAuthenticated, checkGroupAndRoles("User_read"), getDeletedUsers);
router.post('/export-to-excel', ensureAuthenticated, checkGroupAndRoles("User_read"), exportDataToExcel);
router.post('/get-roles', ensureAuthenticated, checkGroupAndRoles("User_read"), getUserRoles);
router.post('/add-group', ensureAuthenticated, checkGroupAndRoles("User_update"), updateUserGroup);
router.post('/remove-group', ensureAuthenticated, checkGroupAndRoles("User_update"), removeUserGroup);
router.get('/get-groups/:id', ensureAuthenticated, checkGroupAndRoles("User_read"), getUserGroup);
router.get("/non-existing-users", ensureAuthenticated, checkGroupAndRoles("User_create"), getNonExistingUsers);

module.exports = router;