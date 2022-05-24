const express = require('express');
const { getStandardShiftTypes, updateStandardShiftTypes } = require('./controller');
const router = express.Router();
const { hr, checkRoles } = require('../../modules/auth/auth');

router.get('/', hr, checkRoles, getStandardShiftTypes);
router.post('/update', hr, checkRoles, updateStandardShiftTypes);

module.exports = router;