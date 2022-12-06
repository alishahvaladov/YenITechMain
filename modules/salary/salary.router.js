const { getSalaryPage, addSalary, getSalaries, renderSalaryByMonthPage } = require("./salary.controller");
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, checkGroupAndRoles } = require("../auth/auth");

router.get("/salary/:id", ensureAuthenticated, checkGroupAndRoles("Salary_read", true), getSalaryPage);
router.get("/", ensureAuthenticated, checkGroupAndRoles("Salary_read", true), getSalaries);
router.get('/salary-by-months', ensureAuthenticated, checkGroupAndRoles("SalaryByMonth_read", true), renderSalaryByMonthPage);

router.post("/add-salary", ensureAuthenticated, checkGroupAndRoles("Salary_create", true), addSalary);


module.exports = router;