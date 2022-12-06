const express = require("express");
const { getDevices, addDevices, updateDevice, getDevicesByID, deleteDevice } = require("./controller");
const { hr, admin, checkRolesForAPI, checkGroupAndRoles, ensureAuthenticated } = require("../../modules/auth/auth");
const router = express.Router();

// router.get("/", admin, checkRolesForAPI, getDevices);
router.get("/", ensureAuthenticated, checkGroupAndRoles("DeviceManagement_read"), getDevices);
router.post("/add", ensureAuthenticated, checkGroupAndRoles("DeviceManagement_create"), addDevices);
router.post("/update", ensureAuthenticated, checkGroupAndRoles("DeviceManagement_update"), updateDevice);
router.get("/by-id", ensureAuthenticated, checkGroupAndRoles("DeviceManagement_read"), getDevicesByID);
router.get("/delete", ensureAuthenticated, checkGroupAndRoles("DeviceManagement_delete"), deleteDevice);

module.exports = router;