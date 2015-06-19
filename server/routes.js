var authController = require('./controllers/authController');

function setup(app) {
	app.route('/api/users/login')
    .get(authController.login);
}

exports.setup = setup;
