const express = require("express");
const { calculateSalary, getSalaries, getSalariesByMonth, exportDataToExcelByMonths, search, searchSalaryByMonts, getSalaryByID, updateSalary } = require("./controller");
const { hr, super_admin, checkRoles } = require("../../modules/auth/auth");
const router = express.Router();

router.get('/calculate-salary', calculateSalary);
router.get('/all/:offset', hr, checkRoles, getSalaries);
router.get('/salary-by-months/:offset', hr, checkRoles, getSalariesByMonth);
router.get('/export-to-excel', hr, checkRoles, exportDataToExcelByMonths);
router.get('/get-salary/:id', hr, checkRoles, getSalaryByID);
router.post('/search', hr, checkRoles, search);
router.post('/update/:id', hr, checkRoles, updateSalary);
router.post('/search-salary-by-months', hr, checkRoles, searchSalaryByMonts);

 
module.exports = router;