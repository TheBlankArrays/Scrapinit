//add Controllers to handle the routes
var authController = require('./controllers/authController');
var urlController = require('./controllers/urlController');
var webshot = require('webshot');

var setup = function(app) {
  app.route('/api/users/login')
    .post(authController.login);

  app.route('/api/users/signup')
    .post(authController.signup)
    .get(authController.login);

  app.route("/api/users/logout")
    .get(authController.logout);

  app.route('/api/users/url')
    .post(urlController.addUrl);

  app.route('/api/users/list_urls')
    .get(authController.isAuth, urlController.getList);

  // // Feature return the html from the page
  app.route('/api/users/retrieve_url')
    .post(urlController.getExternalUrl);

  app.route('/api/users/checkUser')
    .get(authController.checkUser);

  //
  // app.route('/api/users/addUrl')
  //    .post(function(req, res, next) {
  // 		console.log(req.body.url);
  // 		var webshot = require('webshot');
  // 		var urlWithoutHTTP = req.body.url.substr(7);
  //
  // 		webshot(req.body.url, '../client/assets/' + urlWithoutHTTP + '.jpg', function(err) {
  // 			// screenshot now saved to google.png// screenshot now saved to hello_world.png
  // 			res.send('assets/' + urlWithoutHTTP + '.jpg');
  //
  // 		});
  // 	});

  app.get('*', function(req, res) {
		res.send('what ? 404', 200);
	});

};
module.exports.setup = setup;
