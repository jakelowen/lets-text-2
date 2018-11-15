const router = require('express').Router();

router.get('/test', (req, res) => {
  res.send('testing response');
});
// router.post('/new', require('./new-user.js'));
// router.post('/delete/:id', require('./delete-user.js'));

module.exports = router;
