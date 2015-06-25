//add Controllers to handle the routes
var authController = require('./controllers/authController');
var urlController = require('./controllers/urlController');
var webshot = require('webshot');

var setup = function(app) {

//Unprotected Routes
  app.route('/api/users/login')
    .post(authController.login);

  app.route('/api/users/signup')
    .post(authController.signup);

  app.route('/api/users/check_User')
    .get(authController.checkUser);

//Protected Routes
  app.route("/api/users/logout")
    .get(authController.isAuth, function(req, res, next){
      // if(successfullyLoggedOut){
      //   res.status(200);
      // } else if(UnsuccessfullyLoggedOut) {
      //   res.status(500);
      // }
    });
    
  app.route("/api/users/url")
    .post(authController.isAuth, function(req, res, next){
      // if(UserURlCreated){
      //   res.status(201);
      // } else if (ServerOrDatbaseError) {
      //   res.status(500);
      }
    });

  app.route("/api/users/url/:idUrl")
    .get(authController.isAuth, function(req, res, next){
      // if(UserUrlFound){
      //   res.status(200).json({userUrl:UserUrl});
      // } else if (UserUrlNotFound){
      //   res.status(400);
      // }
    });

  app.route("/api/screenshot")
    .get(authController.isAuth, function(req, res, next){
      // if(SuccessfullyRetrievedImageFromInternet){
      //   res.status(200).json({img:img});
      // } else if(errorRetrievingWebImage){
      //   res.status(404);
      // }
    });


  app.route("/api/users/list")
    .get(authController.isAuth, function(req, res, next){
      // if(succesfullyUrlList){
      //   res.status(200).json({list:list});
      // } else if(urlListNotFound){
      //   res.status(400);
      // }
    });


  app.get('*', function(req, res) {
		res.send('what ? 404', 404);
	});

};
module.exports.setup = setup;
