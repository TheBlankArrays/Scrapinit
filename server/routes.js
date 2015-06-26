//add Controllers to handle the routes
var authController = require('./controllers/authController');
var urlController = require('./controllers/urlController');
var basicScraper = require('./controllers/basicScraperController');

var webshot = require('webshot');
var url = require('url');

var setup = function(app) {

  // Unprotected Routes
  app.route('/api/users/login')
    .post(authController.login);

  app.route('/api/users/signup')
    .post(authController.signup);

  app.route('/api/users/check_User')
    .get(authController.checkUser);

  // Protected Routes
  app.route("/api/users/logout")
    .get(authController.isAuth, authController.logout);

  app.route('/api/users/url')
    .post(authController.isAuth, function(req, res, next) {
      console.log('url route');
      urlController.addUrl(req, res, next);
    });

  app.route("/api/users/url/:idUrl")
    .get(authController.isAuth, urlController.getUrl);

  app.get('/api/screenshot', authController.isAuth, function(req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        console.log('userId in routes.js screenshot ' + req.session.user_id);
        basicScraper.getScreenshot(query.url, req.session.user_id, function(imgpath) {
          res.send(imgpath);
        });
  });

  app.route('/api/users/list')
      .get(authController.isAuth, urlController.getList);

  // All other routes not found, return 404
  app.get('*', function(req, res) {
		res.send('what ? 404', 404);
	});

};
module.exports.setup = setup;
