const express = require("express");
const { calculateSalary, getSalaries, getSalariesByMonth, exportDataToExcelByMonths } = require("./controller");
const { hr, super_admin, checkRoles } = require("../../modules/auth/auth");
const router = express.Router();

router.get("/calculate-salary", calculateSalary);
router.get("/all", hr, checkRoles, getSalaries);
router.get('/salary-by-months', hr, checkRoles, getSalariesByMonth);
router.get('/export-to-excel', hr, checkRoles, exportDataToExcelByMonths);

 
module.exports = router;