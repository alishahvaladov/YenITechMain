const { getFineData, approveEditedFine, resetFine, approveFine, resetApprovedFine, getFinedData, getAllForgivenData} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, admin, checkRoles, audit } = require("../../modules/auth/auth");

router.get("/", hr, admin, checkRoles, getFineData);
router.get("/approve-edited-fine", hr, approveEditedFine);
router.get("/reset-fine", hr, resetFine);
router.get("/approve-fine", hr, checkRoles, approveFine);
router.get('/reset-approved-fine/:id', admin, checkRoles, resetApprovedFine);
router.get('/cumilative/:id', hr, checkRoles, getFinedData);
router.get('/forgiven-fine/:offset', audit, checkRoles, getAllForgivenData);
 
module.exports = router;