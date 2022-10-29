const express = require("express");
const { getWorkCalendars, updateWorkCalendar, getCalendarByDate } = require("./controller");
const { hr, checkRoles, ensureActivated, ensureAuthenticated, checkRolesForAPI } = require("../../modules/auth/auth");
const router = express.Router();

router.get("/", hr, checkRolesForAPI, getWorkCalendars);
router.get("/date", hr, checkRolesForAPI, getCalendarByDate);
router.post("/update", hr, checkRolesForAPI, updateWorkCalendar);

module.exports = router;