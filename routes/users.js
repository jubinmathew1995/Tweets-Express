var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render("login");
});

router.post('/login', function(req, res, next) {
  console.log(req.body);
  res.send('SUCCESSFUL LOGIN');
});

module.exports = router;
