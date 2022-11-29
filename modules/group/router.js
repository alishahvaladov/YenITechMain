const express = require("express");
const { renderGroup, renderAddGroup, renderEditGroup } = require("./controller");
const { hr, checkRolesForAPI, checkRoles } = require("../auth/auth");
const router = express.Router();


router.get("/", hr, checkRoles, renderGroup);
router.get("/add", hr, checkRoles, renderAddGroup);
router.get("/edit/:id", hr, checkRoles, renderEditGroup);

module.exports = router;