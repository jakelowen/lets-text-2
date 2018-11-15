const router = require('express').Router();
const chronNotifications = require('./chronNotifications');

router.get('/chron-notifications', chronNotifications);

module.exports = router;
