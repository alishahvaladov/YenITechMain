const { getFineData, approveEditedFine, resetFine, approveFine, resetApprovedFine, getFinedData} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, admin, checkRoles } = require("../../modules/auth/auth");

router.get("/", hr, admin, checkRoles, getFineData);
router.get("/approve-edited-fine", hr, approveEditedFine);
router.get("/reset-fine", hr, resetFine);
router.get("/approve-fine", hr, approveFine);
router.get('/reset-approved-fine/:id', hr, resetApprovedFine);
router.get('/cumilative/:id', hr, checkRoles, getFinedData);
 
module.exports = router;