const { getFineData, approveEditedFine, resetFine, approveFine, resetApprovedFine, getFinedData, getAllForgivenData} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, admin, checkRoles, audit } = require("../../modules/auth/auth");

router.get("/", hr, admin, checkRoles, getFineData);
router.get("/approve-edited-fine", hr, admin, checkRoles, approveEditedFine);
router.get("/reset-fine", hr, admin, checkRoles, resetFine);
router.get("/approve-fine", hr, admin, checkRoles, approveFine);
router.get('/reset-approved-fine/:id', admin, checkRoles, resetApprovedFine);
router.get('/cumilative/:id', hr, admin, checkRoles, getFinedData);
router.get('/forgiven-fine/:offset', audit, admin, checkRoles, getAllForgivenData);
 
module.exports = router;