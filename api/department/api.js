const express = require("express");
const router = express.Router();
const { getProjectsForDepartments, addDepartment, getDepartmentsByProject } = require("./controller");
const { super_admin, admin, checkRoles, hr } = require("../../modules/auth/auth");

router.get("/", admin, checkRoles, getProjectsForDepartments);
router.post("/add-department", admin, checkRoles, addDepartment);
router.get('/by-project/:id', admin, hr, checkRoles, getDepartmentsByProject);

module.exports = router;