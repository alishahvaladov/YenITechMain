const express = require("express");
const { getProjects, getProjectsForEmpForm } = require("./controller");
const { admin, hr, checkRoles } = require("../../modules/auth/auth");
const router = express.Router();


router.get("/allProjects/:offset", hr, admin, checkRoles, getProjects);
router.get("/getProject/:emp_id", hr, admin, checkRoles, getProjectsForEmpForm);


module.exports = router;