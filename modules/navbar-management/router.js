const express = require("express");
const { renderMainPage, renderEditPage } = require("./controller");
const { ensureAuthenticated, checkGroupAndRoles } = require("../auth/auth");
const router = express.Router();

router.get("/", ensureAuthenticated, checkGroupAndRoles("NavbarManagement_read", true), renderMainPage);
router.get("/edit/:id", ensureAuthenticated, checkGroupAndRoles("NavbarManagement_update", true), renderEditPage);

module.exports = router;