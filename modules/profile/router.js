const express = require('express');
const { renderProfilePage } = require("./controller");
const { ensureActivated, ensureAuthenticated } = require("../auth/auth");
const router = express.Router();

router.get("/", ensureAuthenticated, ensureActivated, renderProfilePage);

module.exports = router;