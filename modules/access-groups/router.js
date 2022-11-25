const express = require("express");
const { renderAccessGroupsAddPage, renderAccessGroupsPage, renderAccessGroupUpdatePage } = require("./controller");
const { hr, admin, checkRoles } = require("../auth/auth");
const router = express.Router();


router.get("/", hr, checkRoles, renderAccessGroupsPage);
router.get("/add", admin, checkRoles, renderAccessGroupsAddPage);
router.get("/update/:id", admin, checkRoles, renderAccessGroupUpdatePage);

module.exports = router;