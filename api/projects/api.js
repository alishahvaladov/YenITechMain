const express = require("express");
const { getProjects, getProjectsForEmpForm, getProjectManagersAndParentProjects, getProjectById, updateProject } = require("./controller");
const { admin, hr, checkRoles } = require("../../modules/auth/auth");
const router = express.Router();


router.get("/allProjects/:offset", hr, admin, checkRoles, getProjects);
router.get("/getProject/:emp_id", hr, admin, checkRoles, getProjectsForEmpForm);
router.get("/project-managers-and-parent-projects", hr, admin, checkRoles, getProjectManagersAndParentProjects);
router.get("/get-project/:project_id", hr, admin, checkRoles, getProjectById);
router.post("/update", hr, admin, checkRoles, updateProject);

module.exports = router;