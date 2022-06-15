const express = require('express');
const { getStandardShiftTypes, updateStandardShiftTypes, updateWorkDatesWeekly } = require('./controller');
const router = express.Router();
const { hr, checkRoles } = require('../../modules/auth/auth');

router.get('/', hr, checkRoles, getStandardShiftTypes);
router.post('/update', hr, checkRoles, updateStandardShiftTypes);
router.post('/update/work-dates', hr, checkRoles, updateWorkDatesWeekly);

module.exports = router;