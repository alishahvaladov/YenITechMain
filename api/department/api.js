const express = require("express");
const router = express.Router();
const { getProjectsForDepartments, addDepartment, getDepartmentsByProject, getAllDepartments, getDepartmentByID, updateDepartmentName, updateProjDeptRel, exportDataToExcel } = require("./controller");
const { ensureAuthenticated, checkGroupAndRoles } = require("../../modules/auth/auth");

router.get("/", ensureAuthenticated, checkGroupAndRoles("Department_read"), getProjectsForDepartments);
router.post("/add-department", ensureAuthenticated, checkGroupAndRoles("Department_create"), addDepartment);
router.get('/by-project/:id', ensureAuthenticated, checkGroupAndRoles("Department_read"), getDepartmentsByProject);
router.post("/allDepartments/:offset", ensureAuthenticated, checkGroupAndRoles("Department_read"), getAllDepartments);
router.get("/department-by-id/:id", ensureAuthenticated, checkGroupAndRoles("Department_read"), getDepartmentByID);
router.get("/update/name/:department_id", ensureAuthenticated, checkGroupAndRoles("Department_update"), updateDepartmentName);
router.get("/update/project/:department_id", ensureAuthenticated, checkGroupAndRoles("Department_update"), updateProjDeptRel);
router.post("/export-to-excel", ensureAuthenticated, checkGroupAndRoles("Department_read"), exportDataToExcel);

module.exports = router;