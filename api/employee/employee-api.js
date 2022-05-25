const { getDepartment, getPosition, getEmployee, empRenderPage, empRenderByPage, exportDataToExcel, updateEmployee, getDeletedEmployees } = require("./api-controller");
const express = require("express");
const router = express.Router();
const { hr, audit, checkRoles } = require("../../modules/auth/auth");


router.post("/department", hr, checkRoles, getDepartment);
router.post("/position", hr, checkRoles, getPosition);
router.post("/employee-data", hr, checkRoles, getEmployee);
router.post("/all-employee", hr, checkRoles, empRenderPage);
router.post("/emp-by-page", hr, checkRoles, empRenderByPage);
router.post("/download-excel", hr, checkRoles, exportDataToExcel);
router.post("/update-employee", hr, checkRoles, updateEmployee);
router.post("/deleted-employees", hr, audit, checkRoles, getDeletedEmployees);

module.exports = router;