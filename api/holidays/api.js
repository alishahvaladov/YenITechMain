const express = require("express");
const { getHoldiays, addHolidayDate } = require("./controller");
const { hr, checkRoles, ensureActivated, ensureAuthenticated } = require("../../modules/auth/auth");
const router = express.Router();

router.get("/all", ensureActivated, ensureAuthenticated, checkRoles, getHoldiays);
router.post("/add/holiday-date", hr, checkRoles, addHolidayDate);

module.exports = router;