const express = require("express");
const { getDevices, addDevices, updateDevice } = require("./controller");
const { hr, admin, checkRolesForAPI } = require("../../modules/auth/auth");
const router = express.Router();

// router.get("/", admin, checkRolesForAPI, getDevices);
router.get("/", getDevices);
router.post("/add", addDevices);
router.post("/update", updateDevice);

module.exports = router;