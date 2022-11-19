const express = require("express");
const { renderGroup, renderAddGroup } = require("./controller");
const { hr, checkRolesForAPI } = require("../auth/auth");
const router = express.Router();


router.get("/", hr, checkRolesForAPI, renderGroup);
router.get("/add", hr, checkRolesForAPI, renderAddGroup);

module.exports = router;