const express = require('express');
const { renderProfile } = require('./controller');
const { ensureAuthenticated, ensureActivated } = require("../../modules/auth/auth");
const router = express.Router();


router.get('/', ensureAuthenticated, ensureActivated, renderProfile);

module.exports = router;