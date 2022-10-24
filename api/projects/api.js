const express = require("express");
const { getProjects, getProjectsForEmpForm, getProjectManagersAndParentProjects, getProjectById, updateProject, exportDataToExcel, addProject } = require("./controller");
const { admin, hr, checkRoles, checkRolesForAPI } = require("../../modules/auth/auth");
const router = express.Router();


router.post("/allProjects/:offset", hr, admin, checkRolesForAPI, getProjects);
router.get("/getProject/:emp_id", hr, admin, checkRolesForAPI, getProjectsForEmpForm);
router.get("/project-managers-and-parent-projects", hr, admin, checkRolesForAPI, getProjectManagersAndParentProjects);
router.get("/get-project/:project_id", hr, admin, checkRolesForAPI, getProjectById);
router.post("/update", hr, admin, checkRolesForAPI, updateProject);
router.post("/export-to-excel", hr, admin, checkRolesForAPI, exportDataToExcel);
router.post("/add-project", hr, checkRolesForAPI, addProject);

module.exports = router;