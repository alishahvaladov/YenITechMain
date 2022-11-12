const express = require("express");
const { calculateSalary, getSalaries, getSalariesByMonth, exportDataToExcelByMonths, search, searchSalaryByMonts, getSalaryByID, updateSalary, exportDataToExcel, getCalculatedSalary } = require("./controller");
const { hr, super_admin, checkRoles, checkRolesForAPI } = require("../../modules/auth/auth");
const { getSalary } = require("./service");
const router = express.Router();

router.get('/calculate-salary', calculateSalary);
router.get('/all/:offset', hr, checkRolesForAPI, getSalaries);
router.get('/salary-by-months/:offset', hr, checkRolesForAPI, getSalariesByMonth);
router.get('/export-to-excel', hr, checkRolesForAPI, exportDataToExcelByMonths);
router.post('/export-all-to-excel', hr, checkRolesForAPI, exportDataToExcel);
router.get('/get-salary/:id', hr, checkRolesForAPI, getSalaryByID);
router.post('/search', hr, checkRolesForAPI, search);
router.post('/update/:id', hr, checkRolesForAPI, updateSalary);
router.post('/search-salary-by-months', hr, checkRolesForAPI, searchSalaryByMonts);
router.get('/get-calculated-salary/:id?', getCalculatedSalary);


module.exports = router;