const express = require('express');
const { renderProfilePage, renderTimeOffRequest, renderSalariesPage } = require("./controller");
const { ensureActivated, ensureAuthenticated } = require("../auth/auth");
const router = express.Router();

router.get("/", ensureAuthenticated, ensureActivated, renderProfilePage);
router.get('/salaries', ensureAuthenticated, ensureActivated, renderSalariesPage);
router.get("/request-time-off", ensureAuthenticated, ensureActivated, renderTimeOffRequest);

module.exports = router;