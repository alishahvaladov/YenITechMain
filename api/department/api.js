const express = require("express");
const router = express.Router();
const { getProjectsForDepartments, addDepartment, getDepartmentsByProject, getAllDepartments, getDepartmentByID, updateDepartmentName, updateProjDeptRel, exportDataToExcel } = require("./controller");
const { super_admin, admin, checkRoles, hr, checkRolesForAPI } = require("../../modules/auth/auth");

router.get("/", admin, checkRolesForAPI, getProjectsForDepartments);
router.post("/add-department", admin, checkRolesForAPI, addDepartment);
router.get('/by-project/:id', admin, hr, checkRolesForAPI, getDepartmentsByProject);
router.post("/allDepartments/:offset", admin, checkRolesForAPI, getAllDepartments);
router.get("/department-by-id/:id", hr, checkRolesForAPI, getDepartmentByID);
router.get("/update/name/:department_id", hr, checkRolesForAPI, updateDepartmentName);
router.get("/update/project/:department_id", hr, checkRolesForAPI, updateProjDeptRel);
router.post("/export-to-excel", hr, checkRolesForAPI, exportDataToExcel);

module.exports = router;