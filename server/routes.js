//add Controllers to handle the routes
var authController = require('./controllers/authController');
var urlController = require('./controllers/urlController');

var setup = function(app) {
	app.route('/api/users/login')
    .post(authController.login);
  app.route('/api/users/signup')
    .post(authController.signup)
    .get(authController.login);

	app.route('/api/users/addUrl')
    .post(function(req, res, next) {
			console.log(req.body.url);
			res.send("you are crazy watching this url here: " + req.body.url);
		});
}
module.exports.setup = setup;
