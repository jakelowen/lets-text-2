const router = require('express').Router();
const receive = require('./receive');

router.post('/receive', receive);

module.exports = router;
