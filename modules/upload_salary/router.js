const express = require("express");
const router = express.Router();
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
    readXlsxFile(path.join(__dirname, '../../salaries_xlsx/GHM/February.xlsx')).then((rows) => {
       console.log(rows);
    });
});

module.exports = router;