const { searchFPrint, renderFPrints, getFPrintsByPage } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../../modules/auth/auth");

router.post("/search", hr, searchFPrint);
router.post("/all", hr, renderFPrints);
router.post('/by-page', hr, getFPrintsByPage);

module.exports = router;