const { searchFPrint, renderFPrints, getFPrintsByPage, renderForgottenFPrints, updateForgottenFPrints, exportDataToExcel} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../../modules/auth/auth");

router.post("/search", hr, searchFPrint);
router.post("/all", hr, renderFPrints);
router.post("/by-page", hr, getFPrintsByPage);
router.get("/inappropriate-fprints", hr, renderForgottenFPrints);
router.get("/update/forgotten-fprints", updateForgottenFPrints);
router.post("/export-excel", hr, exportDataToExcel)

module.exports = router;