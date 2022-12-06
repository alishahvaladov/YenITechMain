const express = require("express");
const { renderAccessGroupsAddPage, renderAccessGroupsPage, renderAccessGroupUpdatePage } = require("./controller");
const { ensureAuthenticated, checkGroupAndRoles } = require("../auth/auth");
const router = express.Router();


router.get("/", ensureAuthenticated, checkGroupAndRoles("AccessGroup_read", true), renderAccessGroupsPage);
router.get("/add", ensureAuthenticated, checkGroupAndRoles("AccessGroup_create", true), renderAccessGroupsAddPage);
router.get("/update/:id", ensureAuthenticated, checkGroupAndRoles("AccessGroup_update", true), renderAccessGroupUpdatePage);

module.exports = router;