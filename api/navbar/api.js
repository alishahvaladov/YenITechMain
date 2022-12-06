const express = require("express");
const { getNavs } = require("./controller")
const { ensureAuthenticated, ensureActivated } = require("../../modules/auth/auth");
const router = express.Router();

router.get("/", ensureAuthenticated, getNavs);

module.exports = router;