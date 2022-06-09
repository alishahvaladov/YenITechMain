const express = require("express");
const router = express.Router();
const { ensureActivated, ensureAuthenticated } = require("../auth/auth");
const { renderAllNotifications } = require("./controller");


router.get("/all-notifications", ensureActivated, ensureAuthenticated, renderAllNotifications);

module.exports = router;