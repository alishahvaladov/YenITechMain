const { getFineData, approveEditedFine, resetFine, approveFine, resetApprovedFine} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, admin } = require("../../modules/auth/auth");

router.get("/", admin, getFineData);
router.get("/approve-edited-fine", hr, approveEditedFine);
router.get("/reset-fine", hr, resetFine);
router.get("/approve-fine", hr, approveFine);
router.get('/reset-approved-fine/:id', resetApprovedFine);

module.exports = router;