var CronJob = require('cron').CronJob;
var secret = require('./config.js');
var db = require('../db.js');
var mandrill = require('mandrill-api');
mandrill_client = new mandrill.Mandrill(secret.mandrill.client_id);

var schedule = '0 */5 * * * *';
//To run every 3 seconds do */3; every 5 min do * */5 *

var cronjob = new CronJob(schedule, function() {
  console.log('You will see this message every 5 min');
  // check database for jobs assigned for cronjob
  // db
  // get urls 

  // render the page and compare if it changed 
  // if change occured changed=true;
  // if change  occured then send an email
  var changed = false;
  if (changed) {
    sendEmail('', '');
    changed = false;
  }


}, null, true, 'America/Los_Angeles');

var sendEmail = function (email, name){
  var message = {
    "html": "<span>The Scrapinit found a change in the webpage you are following</span>",
    "subject": "We scraped some tubular stuff for you!!",
    "from_email": email,
    "from_name": "The Blank Arrays",
    "to": [{
      "email": email,
      "name":  name,
      "type": "to"
    },
    ],
    "headers": {
      "Reply-To": ""
    },
    "important": true,
  };

var async = false;
//send email // uncomment to send an email
mandrill_client.messages.send({"message": message, "async": async}, function(result) {
  console.log('Sent a message to '+ email+'  '+ result);
}, function(e) {
            // Mandrill returns the error as an object with name and message keys
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
  });
};var Sequelize = require("sequelize");
var dbConfig = require("./dbConfig");

var sequelize = dbConfig.connect('./db/db.sqlite');
var schemas = dbConfig.createSchemas(sequelize, true);

/**
  * Export the differents models
**/
exports.User = schemas.User;



;var Sequelize = require("sequelize");

//no password
var connect = function(dbPath) {
	var sequelize = new Sequelize('database', 'root', '', {
		host:'localhost',
		dialect: 'sqlite',

		// use pooling in order to reduce db connection overload and to increase speed
		// currently only for mysql and postgresql (since v1.5.0)
		//not sure exactly what this does, copying config documentation
		// pool: {
		// 	max: 5,
		// 	min: 0,
		// 	idle: 10000
		// },

		logging: false,

		storage: dbPath
	});

	return sequelize;
};

//construct is just a boolean input - allows same function to be used for testing and the actual server
var createSchemas = function(dbConnection, construct) {
	var tableConfig = {
		underscored: true,
		timestamps: true,
		freezeTableName: false
	};

	//Models
	var User = require('./db/models/User')(dbConnection, tableConfig);
	var Url = require('./db/models/Url')(dbConnection, tableConfig);
	var UserUrl = require('./db/models/UserUrl')(dbConnection, tableConfig);

      // relationship 
      User.belongsToMany(Url, { through: UserUrl});
      Url.belongsToMany(User, { through: UserUrl});


	//Basically check if tables exists, if not, creates it
	if (construct) {
		User.sync();
            Url.sync();
            UserUrl.sync();
	}

	return {
		User: User,
		Url: Url,
		UserUrl: UserUrl
	}
};

exports.connect = connect;
exports.createSchemas = createSchemas;


;//add Controllers to handle the routes
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
;var express = require('express');
var app = express();
//run the sqlite
var db = require('./db');
//middleware that automatically logs responses, requests, and associated data
var logger = require('morgan');
var routes = require('./routes');
var parser = require('body-parser');
var session = require('express-session');
var cors = require('cors');

/*allows the server to automatically process urlencoded stuff into a javscript object
if we decided to pass JSON to the server instead we'll need to change this to parser.JSON()*/
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
//set up sessions
app.use(session({
	secret: 'scrapinit top secret',
	resave: false,
	saveUninitialized: false
}));

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  console.log('request: method -' + req.method);
  console.log('request: url - ' + req.url);
  next();
});


//serves the client
app.use(express.static(__dirname + '/../client/'));
// Initialize passport and passport session
// passport session invocation must be after the express sessions declaration as it is going to piggyback on that
// app.use(passport.initialize());
// app.use(passport.session());

//allows cors
app.use(cors());

app.get('*', function(req, res) {
	res.send('what ? 404', 200);
});

//start server functions and export
var initServer = function() {
	//attachs all the routes to the server
	//console.log(app);
	routes.setup(app);
	//if deployed to heroku will use heroku port, otherwise on local machine will use port 3000
	var port = process.env.port || 3000;
	var server = app.listen(port);
	//layers socket.io ontop of the express server
	console.log("Express server listening on %d in %s mode", port, app.settings.env)
}

initServer();
exports.app = app;
