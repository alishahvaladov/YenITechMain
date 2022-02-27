const { getAllFPrints, exportDataToExcel } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth");

router.get("/", hr, (req, res) => {
    if(req.user.role === 1) {
        res.render("all-fprints", {
            super_admin: true
        });
    } else if (req.user.role === 5) {
        res.render("all-fprints", {
            hr: true
        });
    } 
});
router.post("/api", hr, getAllFPrints);
router.post("/api/excel-report", hr, exportDataToExcel);


module.exports = router;