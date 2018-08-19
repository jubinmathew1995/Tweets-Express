var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
 	// res.send('requested LOGIN page');
 	res.render('input', {loginType: true});
});

router.post('/', (req, res, next) => {
	console.log(req.body);
	// res.send("POST request for login");
	res.redirect('/');
});

module.exports = router;
