const router = require('express').Router();
const twilioRoutes = require('./twilioWebHooks');
const triggerRoutes = require('./triggers');

router.get('/test', (req, res) => {
  res.send('testing response');
});
router.use('/twilio', twilioRoutes);
router.use('/triggers', triggerRoutes);
// router.post('/new', require('./new-user.js'));
// router.post('/delete/:id', require('./delete-user.js'));

module.exports = router;
