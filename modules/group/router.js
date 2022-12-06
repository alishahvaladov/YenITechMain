const express = require("express");
const { renderGroup, renderAddGroup, renderEditGroup } = require("./controller");
const { ensureAuthenticated, checkGroupAndRoles } = require("../auth/auth");
const router = express.Router();


router.get("/", ensureAuthenticated, checkGroupAndRoles("Group_read", true), renderGroup);
router.get("/add", ensureAuthenticated, checkGroupAndRoles("Group_create", true), renderAddGroup);
router.get("/edit/:id", ensureAuthenticated, checkGroupAndRoles("Group_update", true), renderEditGroup);

module.exports = router;