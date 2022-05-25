const express = require('express');
const { renderProfilePage, renderTimeOffRequest, renderSalariesPage, renderUserTimeOffPage } = require("./controller");
const { ensureActivated, ensureAuthenticated } = require("../auth/auth");
const router = express.Router();

router.get("/", ensureAuthenticated, ensureActivated, renderProfilePage);
router.get('/salaries', ensureAuthenticated, ensureActivated, renderSalariesPage);
router.get("/request-time-off", ensureAuthenticated, ensureActivated, renderTimeOffRequest);
router.get('/my-time-off-requests', ensureAuthenticated, ensureActivated, renderUserTimeOffPage);

module.exports = router;