const express = require("express");
const { getExcelTemplate, calculateWorkDays, readImportedExcel } = require("./controller");
const router = express.Router();

router.get("/template", getExcelTemplate);
router.get("/calculateWorkDays", calculateWorkDays);
router.post("/upload-excel", readImportedExcel);

module.exports = router;
