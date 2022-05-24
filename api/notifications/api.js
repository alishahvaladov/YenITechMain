const express = require('express');
const { sendNotification, updateNotificationSeen, getLastFourNotification } = require('./controller');
const { hr, admin, ensureAuthenticated, ensureActivated } = require('../../modules/auth/auth');
const router = express.Router();

router.get('/', ensureAuthenticated, sendNotification);
router.get('/update-notification/:id', ensureActivated, ensureAuthenticated, updateNotificationSeen);
router.get('/last-notifications', ensureActivated, ensureAuthenticated, getLastFourNotification);

module.exports = router;