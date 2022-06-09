const express = require("express");
const router = express.Router();
const { getProjectsForDepartments, addDepartment, getDepartmentsByProject, getAllDepartments, getDepartmentByID, updateDepartmentName, updateProjDeptRel } = require("./controller");
const { super_admin, admin, checkRoles, hr } = require("../../modules/auth/auth");

router.get("/", admin, checkRoles, getProjectsForDepartments);
router.post("/add-department", admin, checkRoles, addDepartment);
router.get('/by-project/:id', admin, hr, checkRoles, getDepartmentsByProject);
router.get("/allDepartments/:offset", admin, checkRoles, getAllDepartments);
router.get("/department-by-id/:id", hr, checkRoles, getDepartmentByID);
router.get("/update/name/:department_id", hr, checkRoles, updateDepartmentName);
router.get("/update/project/:department_id", hr, checkRoles, updateProjDeptRel);

module.exports = router;