//add Controllers to handle the routes
var authController = require('./controllers/authController');
var urlController = require('./controllers/urlController');

var setup = function(app) {
	app.route('/api/users/login')
    .post(authController.login);
  app.route('/api/users/signup')
    .post(authController.signup)
    .get(authController.login);
  app.route('/user/urls')
    .get(urlController.getUrls)
    .post(urlController.postUrl); 
  app.route('/user/url')
    .post(urlController.getExternalUrl);
};

exports.module.setup = setup;

