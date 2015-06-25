//add Controllers to handle the routes
var authController = require('./controllers/authController');
var urlController = require('./controllers/urlController');
var basicScraper = require('./controllers/basicScraperController');
var url = require('url');

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


  app.get('/api/getScreenshot', function(req, res, next) {
          var url_parts = url.parse(req.url, true);
          var query = url_parts.query;
          basicScraper.getScreenshot(query.url, req.session.id, function(imgpath) {
            res.send(imgpath);
          });
  	 });

  app.route('/api/cropImg')
      .post(function(req, res, next) {
        console.log('c.x' + req.body.crop.x);
        console.log('urlImg' + req.body.urlImg);

        basicScraper.cropImg(req.body.urlImg, req.body.crop, function(cropImg) {
          res.send(cropImg);
        });

      });

  app.get('*', function(req, res) {
		res.send('what ? 404', 200);
	});

};
module.exports.setup = setup;
