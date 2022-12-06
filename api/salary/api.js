const express = require("express");
const { calculateSalary, getSalaries, getSalariesByMonth, exportDataToExcelByMonths, search, searchSalaryByMonts, getSalaryByID, updateSalary, exportDataToExcel, getCalculatedSalary } = require("./controller");
const { ensureAuthenticated, checkGroupAndRoles } = require("../../modules/auth/auth");
const { getSalary } = require("./service");
const router = express.Router();

// router.get('/calculate-salary', calculateSalary);
router.get('/all/:offset', ensureAuthenticated, checkGroupAndRoles("Salary_read"), getSalaries);
router.get('/salary-by-months/:offset', ensureAuthenticated, checkGroupAndRoles("SalaryByMonth_read"), getSalariesByMonth);
router.get('/export-to-excel', ensureAuthenticated, checkGroupAndRoles("SalaryByMonth_read"), exportDataToExcelByMonths);
router.post('/export-all-to-excel', ensureAuthenticated, checkGroupAndRoles("Salary_read"), exportDataToExcel);
router.get('/get-salary/:id', ensureAuthenticated, checkGroupAndRoles("Salary_read"), getSalaryByID);
router.post('/search', ensureAuthenticated, checkGroupAndRoles("Salary_read"), search);
router.post('/update/:id', ensureAuthenticated, checkGroupAndRoles("Salary_update"), updateSalary);
router.post('/search-salary-by-months', ensureAuthenticated, checkGroupAndRoles("SalaryByMonth_read"), searchSalaryByMonts);
router.get('/get-calculated-salary/:id?', getCalculatedSalary);


module.exports = router;