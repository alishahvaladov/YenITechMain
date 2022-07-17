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
const { hr, audit, checkRoles, checkRolesForAPI, admin, deptDirector } = require("../../modules/auth/auth");


router.post("/department", hr, checkRoles, getDepartment);
router.post("/position", hr, checkRoles, getPosition);
router.post("/employee-data", hr, audit, admin, deptDirector, checkRolesForAPI, getEmployee);
router.post("/all-employee", hr, audit, admin, deptDirector, checkRolesForAPI, empRenderPage);
router.post("/emp-by-page", hr, audit, admin, deptDirector, checkRolesForAPI, empRenderByPage);
router.post("/download-excel", hr, checkRolesForAPI, exportDataToExcel);
router.post("/update-employee", hr, checkRoles, updateEmployee);
router.post("/deleted-employees", hr, audit, checkRoles, getDeletedEmployees);
router.post("/employee/add", hr, checkRoles, addEmployee);


module.exports = router;