const express = require("express");
const { getTimeOffs } = require("./controller");
const { hr, ensureAuthenticated, ensureActivated } = require("../../modules/auth/auth");
const router = express.Router();

router.post("/", ensureAuthenticated, getTimeOffs);

module.exports = router;