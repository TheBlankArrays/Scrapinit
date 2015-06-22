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
/**
  * Feature return the html from the page
  app.route('/api/users/retrieve_url')
    .post(urlController.getExternalUrl);
**/

	
/**
  * Feature screenshot to webpage to select area
  app.route('/api/users/addUrl')
    .post(function(req, res, next) {
			console.log(req.body.url);
			var webshot = require('webshot');
			var urlWithoutHTTP = req.body.url.substr(7);

			webshot(req.body.url, '../client/assets/' + urlWithoutHTTP + '.jpg', function(err) {
				// screenshot now saved to google.png// screenshot now saved to hello_world.png
				res.send('assets/' + urlWithoutHTTP + '.jpg');

			});
		});
**/
};
module.exports.setup = setup;
