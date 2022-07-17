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
const { hr, admin, audit, checkRolesForAPI } = require("../../modules/auth/auth");

const router = express.Router();

router.get("/employee-count", hr, audit, checkRolesForAPI, getEmployeeCount);
router.get("/given-salaries", hr, audit, checkRolesForAPI, getGivenSalariesByMonths);
router.get("/inappropriate-fprints", hr, audit, checkRolesForAPI, getInappropriateFPrintsCount);
router.get("/last-employees", hr, audit, checkRolesForAPI, getLastMonthEmployeeCount);
router.get("/last-month-salary", hr, audit, checkRolesForAPI, getLastMonthSalaryCount);
router.get("/last-notifications", hr, audit, checkRolesForAPI, getLastNotifications);
router.get("/last-timeoffs", hr, audit, checkRolesForAPI, getLastTimeOffs);
router.get("/salary-sum-by-department", hr, audit, checkRolesForAPI, getSalarySumForEachDepartment);


module.exports = router;