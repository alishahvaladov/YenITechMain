const express = require('express');
const { renderStandardWorkingHours } = require('./controller');
const router = express.Router();
const { hr, checkRoles, ensureAuthenticated, ensureActivated } = require('../auth/auth');

router.get('/', ensureAuthenticated, ensureActivated, checkRoles, renderStandardWorkingHours);

module.exports = router;