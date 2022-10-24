const { getFineData, approveEditedFine, resetFine, approveFine, resetApprovedFine, getFinedData, getAllForgivenData, exportDataToExcel} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, admin, checkRoles, audit, checkRolesForAPI } = require("../../modules/auth/auth");

router.post("/", hr, admin, checkRolesForAPI, getFineData);
router.get("/approve-edited-fine", hr, admin, checkRolesForAPI, approveEditedFine);
router.get("/reset-fine", hr, admin, checkRolesForAPI, resetFine);
router.get("/approve-fine", hr, admin, checkRolesForAPI, approveFine);
router.get('/reset-approved-fine/:id', admin, checkRolesForAPI, resetApprovedFine);
router.get('/cumilative/:id', hr, admin, checkRolesForAPI, getFinedData);
router.get('/forgiven-fine/:offset', audit, admin, checkRolesForAPI, getAllForgivenData);
router.post('/export-to-excel', audit, hr, checkRolesForAPI, exportDataToExcel);

module.exports = router;