const express = require("express");
const { getProjects } = require("./controller");
const { admin, hr, checkRoles } = require("../../modules/auth/auth");
const router = express.Router();


router.get("/allProjects", hr, admin, checkRoles, getProjects);

module.exports = router;