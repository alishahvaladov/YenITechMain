const express = require('express');
const { renderProfile, getProfilePicture, getUserDataAsEmployee, addTimeOff } = require('./controller');
const { ensureAuthenticated, ensureActivated, checkRoles } = require("../../modules/auth/auth");
const router = express.Router();


router.get('/', ensureAuthenticated, ensureActivated, renderProfile);
router.get('/profile-picture', ensureAuthenticated, ensureActivated, getProfilePicture);
router.get('/user-data', ensureAuthenticated, ensureActivated, getUserDataAsEmployee);
router.post('/request-time-off', ensureAuthenticated, ensureActivated, addTimeOff);

module.exports = router;