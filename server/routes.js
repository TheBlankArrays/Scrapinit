//add Controllers to handle the routes
var authController = require('./controllers/authController');

function setup(app) {
	app.route('/api/users/login')
    .post(authController.login);
  app.route('/api/users/signup')
    .post(authController.signup);
};

exports.setup = setup;
