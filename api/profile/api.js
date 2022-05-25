const express = require('express');
const { renderProfile, getProfilePicture, getUserDataAsEmployee, addTimeOff, getSalaryByMonthsForUser, getUserTimeOffs } = require('./controller');
const { ensureAuthenticated, ensureActivated, checkRoles } = require("../../modules/auth/auth");
const router = express.Router();


router.get('/', ensureAuthenticated, ensureActivated, renderProfile);
router.get('/profile-picture', ensureAuthenticated, ensureActivated, getProfilePicture);
router.get('/user-data', ensureAuthenticated, ensureActivated, getUserDataAsEmployee);
router.post('/request-time-off', ensureAuthenticated, ensureActivated, addTimeOff);
router.get('/salaries/:offset', ensureAuthenticated, ensureActivated, getSalaryByMonthsForUser);
router.get('/my-time-off-requests', ensureAuthenticated, ensureActivated, getUserTimeOffs);

module.exports = router;