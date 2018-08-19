let express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
	// res.send('requested REGISTER page');
	res.render('input', {registerType: true});
});

router.post('/', (req, res, next) => {
	console.log(req.body);
	// res.send("POST request for register");
	res.redirect('/');
});

module.exports = router;