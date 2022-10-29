const express = require("express");
const { calcualteVacSalary } = require("./controller");
const router = express.Router();

router.get("/calculate", calcualteVacSalary);

module.exports = router;
