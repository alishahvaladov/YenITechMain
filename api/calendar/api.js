const express = require("express");
const { getWorkCalendars } = require("./controller");
const { hr, checkRoles, ensureActivated, ensureAuthenticated, checkRolesForAPI } = require("../../modules/auth/auth");
const router = express.Router();

router.post("/", hr, checkRolesForAPI, getWorkCalendars);

module.exports = router;