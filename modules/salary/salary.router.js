const { getSalaryPage, addSalary, getSalaries, renderSalaryByMonthPage } = require("./salary.controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../auth/auth");

router.get("/salary/:id", hr, getSalaryPage);
router.get("/", hr, getSalaries);
router.get('/salary-by-months', hr, renderSalaryByMonthPage);

router.post("/add-salary", hr, addSalary);


module.exports = router;