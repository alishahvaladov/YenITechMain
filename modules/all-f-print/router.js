const { getAllFPrints, exportDataToExcel } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth");

router.get("/", hr, (req, res) => {
    res.render("all-fprints");
});
router.post("/api", hr, getAllFPrints);
router.post("/api/excel-report", hr, exportDataToExcel);

module.exports = router;