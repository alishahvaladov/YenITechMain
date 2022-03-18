const express = require('express');
const { sendNotification } = require('./controller');
const { hr, admin, ensureAuthenticated } = require('../../modules/auth/auth');
const router = express.Router();

router.get('/', ensureAuthenticated, sendNotification);

module.exports = router;