const express = require("express");
const { getNavs } = require("./controller")
const { hr, deptDirector, checkRoles, checkRolesForAPI, ensureAuthenticated, ensureActivated } = require("../../modules/auth/auth");
const router = express.Router();

router.get("/", ensureAuthenticated, ensureActivated, checkRolesForAPI, getNavs);

module.exports = router;