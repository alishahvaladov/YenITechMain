const { getFineData, approveEditedFine, resetFine, approveFine} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../../modules/auth/auth");

router.get("/", hr, getFineData);
router.get("/approve-edited-fine", hr, approveEditedFine);
router.get("/reset-fine", hr, resetFine);
router.get("/approve-fine", hr, approveFine);

module.exports = router;