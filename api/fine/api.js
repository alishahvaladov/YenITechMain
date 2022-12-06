const { getFineData, approveEditedFine, resetFine, approveFine, resetApprovedFine, getFinedData, getAllForgivenData, exportDataToExcel} = require("./controller");
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, checkGroupAndRoles } = require("../../modules/auth/auth");

router.post("/", ensureAuthenticated, checkGroupAndRoles("Fine_read"), getFineData);
router.get("/approve-edited-fine", ensureAuthenticated, checkGroupAndRoles("Fine_read"), approveEditedFine);
router.get("/reset-fine", ensureAuthenticated, checkGroupAndRoles("Fine_update"), resetFine);
router.get("/approve-fine", ensureAuthenticated, checkGroupAndRoles("Fine_update"), approveFine);
router.get('/reset-approved-fine/:id', ensureAuthenticated, checkGroupAndRoles("Fine_update"), resetApprovedFine);
router.get('/cumilative/:id', ensureAuthenticated, checkGroupAndRoles("Fine_read"), getFinedData);
router.get('/forgiven-fine/:offset', ensureAuthenticated, checkGroupAndRoles("Fine_read"), getAllForgivenData);
router.post('/export-to-excel', ensureAuthenticated, checkGroupAndRoles("Fine_read"), exportDataToExcel);

module.exports = router;