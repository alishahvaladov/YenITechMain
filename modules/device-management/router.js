const express = require("express");
const { renderDeviceManagement, renderDeviceAddPage } = require("./controller");
const { admin, checkRoles } = require("../auth/auth");
const router = express.Router();

router.get("/", admin, checkRoles, renderDeviceManagement);
router.get("/add", admin, checkRoles, renderDeviceAddPage);

module.exports = router;