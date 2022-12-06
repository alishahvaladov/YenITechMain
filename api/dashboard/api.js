const express = require('express');
const {
    getEmployeeCount,
    getGivenSalariesByMonths,
    getInappropriateFPrintsCount,
    getLastMonthEmployeeCount,
    getLastMonthSalaryCount,
    getLastNotifications,
    getLastTimeOffs,
    getSalarySumForEachDepartment
} = require("./controller");
const { ensureAuthenticated, checkGroupAndRoles } = require("../../modules/auth/auth");

const router = express.Router();

router.get("/employee-count", ensureAuthenticated, checkGroupAndRoles("Employee_read"), getEmployeeCount);
router.get("/given-salaries", ensureAuthenticated, checkGroupAndRoles("Salary_read"), getGivenSalariesByMonths);
router.get("/inappropriate-fprints", ensureAuthenticated, checkGroupAndRoles("FPrints_read"), getInappropriateFPrintsCount);
router.get("/last-employees", ensureAuthenticated, checkGroupAndRoles("Employee_read"), getLastMonthEmployeeCount);
router.get("/last-month-salary", ensureAuthenticated, checkGroupAndRoles("SalaryByMonth_read"), getLastMonthSalaryCount);
router.get("/last-notifications", ensureAuthenticated, getLastNotifications);
router.get("/last-timeoffs", ensureAuthenticated, checkGroupAndRoles("TimeOffRequest_read"), getLastTimeOffs);
router.get("/salary-sum-by-department", ensureAuthenticated, checkGroupAndRoles("SalaryByMonth_read"), getSalarySumForEachDepartment);


module.exports = router;