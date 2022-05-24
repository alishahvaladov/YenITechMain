const express = require('express');
const { renderStandardWorkingHours } = require('./controller');
const router = express.Router();
const { hr, checkRoles } = require('../auth/auth');

router.get('/', hr, checkRoles, renderStandardWorkingHours);

module.exports = router;