var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/info', require('./info.js'));
router.use('/test', require('./test.js'));
module.exports = router;