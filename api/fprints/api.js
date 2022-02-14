const { searchFPrint, renderFPrints, getFPrintsByPage, renderForgottenFPrints, updateForgottenFPrints} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../../modules/auth/auth");

router.post("/search", hr, searchFPrint);
router.post("/all", hr, renderFPrints);
router.post("/by-page", hr, getFPrintsByPage);
router.get("/inappropriate-fprints", hr, renderForgottenFPrints);
router.get("/update/forgotten-fprints", updateForgottenFPrints);

module.exports = router;