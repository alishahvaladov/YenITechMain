const express = require('express');
const { renderHolidayPage } = require("./controller");
const { hr, ensureAuthenticated, ensureActivated, checkRoles } = require("../../modules/auth/auth");
const router = express.Router();

router.get("/", ensureAuthenticated, ensureActivated, checkRoles, renderHolidayPage);

module.exports = router;