const { getDepartment, getPosition, getEmployee } = require("./api-controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../../modules/auth/auth");


router.post("/department", hr, getDepartment);
router.post("/position", hr, getPosition);
router.post("/employee-data", hr, getEmployee);

module.exports = router;