const express = require("express");
const { renderMainPage, renderEditPage } = require("./controller");
const { admin, checkRoles } = require("../auth/auth");
const router = express.Router();

router.get("/", admin, checkRoles, renderMainPage);
router.get("/edit/:id", admin, checkRoles, renderEditPage);

module.exports = router;