const express = require("express");
const { getHoldiays, addHolidayDate } = require("./controller");
const { hr, checkRoles } = require("../../modules/auth/auth");
const router = express.Router();

router.get("/all", hr, checkRoles, getHoldiays);
router.post("/add/holiday-date", hr, checkRoles, addHolidayDate);

module.exports = router;