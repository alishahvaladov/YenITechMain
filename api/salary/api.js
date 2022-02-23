const express = require("express");
const { calculateSalary } = require("./controller");
const { hr } = require("../../modules/auth/auth");
const router = express.Router();

router.get("/", calculateSalary);


module.exports = router;