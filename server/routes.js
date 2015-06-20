//add Controllers to handle the routes
var authController = require('./controllers/authController');
var urlController = require('./controllers/urlController');

var setup = function(app) {
  app.route('/api/users/login')
    .post(authController.login);

  app.route('/api/users/signup')
    .post(authController.signup)
    .get(authController.login);

  app.route('/api/users/urls')
    .get(urlController.getUrls)
    .post(urlController.postUrl); 

  app.route('/api/users/retrieveUrl')
    .post(urlController.getExternalUrl);

};
module.exports.setup = setup;
