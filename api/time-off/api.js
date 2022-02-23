const { getEmpInfo, getTimeOffs, addTimeOff} = require("./controller");
const express = require("express");
const router = express.Router();
const { hr, ensureAuthenticated} = require("../../modules/auth/auth");


router.post("/emp-info", hr, getEmpInfo);
router.get("/", ensureAuthenticated, getTimeOffs);
router.post('/add', hr, addTimeOff);


module.exports = router;