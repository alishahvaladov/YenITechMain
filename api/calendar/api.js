const express = require("express");
const { getWorkCalendars, updateWorkCalendar, getCalendarByDate } = require("./controller");
const { ensureAuthenticated, checkGroupAndRoles } = require("../../modules/auth/auth");
const router = express.Router();

router.get("/", ensureAuthenticated, checkGroupAndRoles("WorkCalendar_read"), getWorkCalendars);
router.get("/date", ensureAuthenticated, checkGroupAndRoles("WorkCalendar_read"), getCalendarByDate);
router.post("/update", ensureAuthenticated, checkGroupAndRoles("WorkCalendar_update"), updateWorkCalendar);

module.exports = router;