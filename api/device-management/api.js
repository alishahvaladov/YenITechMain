const express = require("express");
const { getDevices, addDevices, updateDevice, getDevicesByID } = require("./controller");
const { hr, admin, checkRolesForAPI } = require("../../modules/auth/auth");
const router = express.Router();

// router.get("/", admin, checkRolesForAPI, getDevices);
router.get("/", getDevices);
router.post("/add", admin, checkRolesForAPI, addDevices);
router.post("/update", updateDevice);
router.get("/by-id", getDevicesByID);

module.exports = router;