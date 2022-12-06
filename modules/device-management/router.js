const express = require("express");
const { renderDeviceManagement, renderDeviceAddPage } = require("./controller");
const { ensureAuthenticated, checkGroupAndRoles } = require("../auth/auth");
const router = express.Router();

router.get("/", ensureAuthenticated, checkGroupAndRoles("DeviceManagement_read", true), renderDeviceManagement);
router.get("/add", ensureAuthenticated, checkGroupAndRoles("DeviceManagement_create", true), renderDeviceAddPage);

module.exports = router;