const {
    getDepartment,
    getPosition,
    getEmployee,
    empRenderPage,
    empRenderByPage,
    exportDataToExcel,
    updateEmployee,
    getDeletedEmployees,
    addEmployee
} = require("./api-controller");
const express = require("express");
const router = express.Router();
const { hr, audit, checkRoles, checkRolesForAPI, checkGroupAndRoles, admin, deptDirector, ensureAuthenticated } = require("../../modules/auth/auth");


router.post("/department", ensureAuthenticated, checkGroupAndRoles("Employee_read"), getDepartment);
router.post("/position", ensureAuthenticated, checkGroupAndRoles("Employee_read"), getPosition);
router.post("/employee-data", ensureAuthenticated, checkGroupAndRoles("Employee_read"), getEmployee);
router.post("/all-employee", ensureAuthenticated, checkGroupAndRoles("Employee_read"), empRenderPage);
router.post("/emp-by-page", ensureAuthenticated, checkGroupAndRoles("Employee_read"), empRenderByPage);
router.post("/download-excel", ensureAuthenticated, checkGroupAndRoles("Employee_read"), exportDataToExcel);
router.post("/update-employee", ensureAuthenticated, checkGroupAndRoles("Employee_update"), updateEmployee);
router.post("/deleted-employees", ensureAuthenticated, checkGroupAndRoles("Employee_read"), getDeletedEmployees);
router.post("/employee/add", ensureAuthenticated, checkGroupAndRoles("Employee_create"), addEmployee);


module.exports = router;