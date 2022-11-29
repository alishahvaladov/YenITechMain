const express = require("express");
const { getNoFPrints, exportDataToExcel, update } = require("./controller");
const { hr, checkRolesForAPI } = require("../../modules/auth/auth");
const router = express.Router(); 

router.post("/", hr, checkRolesForAPI, getNoFPrints);
router.post("/export-excel", hr, checkRolesForAPI, exportDataToExcel);
router.post("/update", hr, checkRolesForAPI, update);

module.exports = router;