const { getEmpInfo } = require("./controller");
const express = require("express");
const router = express.Router();
const { hr } = require("../../modules/auth/auth");


router.post("/emp-info", hr, getEmpInfo);

module.exports = router;