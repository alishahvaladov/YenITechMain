const express = require('express');
const { renderProfile, getProfilePicture } = require('./controller');
const { ensureAuthenticated, ensureActivated, checkRoles } = require("../../modules/auth/auth");
const router = express.Router();


router.get('/', ensureAuthenticated, ensureActivated, renderProfile);
router.get('/profile-picture', ensureAuthenticated, ensureActivated, getProfilePicture);

module.exports = router;