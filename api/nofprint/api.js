const express = require("express");
const { getNoFPrints, exportDataToExcel } = require("./controller");
const { hr, checkRolesForAPI } = require("../../modules/auth/auth");
const router = express.Router(); 

router.post("/", hr, checkRolesForAPI, getNoFPrints);
router.post("/export-excel", hr, exportDataToExcel);

module.exports = router;