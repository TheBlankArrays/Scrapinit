//add Controllers to handle the routes
var authController = require('./controllers/authController');
var urlController = require('./controllers/urlController');
var basicScraper = require('./basicScraperController');

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
    .post(function(req, res, next) {
      urlController.addUrl(req, res, next);
    });

  app.route('/api/users/list_urls')
    .get(authController.isAuth, urlController.getList);

  // // Feature return the html from the page
  app.route('/api/users/getListsOfUrls')
   .get(authController.isAuth, function(req, res, next) {
     urlController.getListOfUrls(req, res, next);
   });

  app.route('/api/users/checkUser')
    .get(authController.checkUser);


  app.route('/api/getScreenshot')
     .get(function(req, res, next) {
          basicScraper.getScreenshot(req.body.url, req.session.id, function(imgpath) {
            res.send();
          });
  	 });

  app.get('*', function(req, res) {
		res.send('what ? 404', 200);
	});

};
module.exports.setup = setup;
