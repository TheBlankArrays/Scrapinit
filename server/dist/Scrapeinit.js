var Sequelize = require("sequelize");
var dbConfig = require("./dbConfig");

var sequelize = dbConfig.connect('./db/db.sqlite');
var schemas = dbConfig.createSchemas(sequelize, true);

/**
  * Export the differents models
**/
exports.User = schemas.User;

lll

;var Sequelize = require("sequelize");

//no password
var connect = function(dbPath) {
	var sequelize = new Sequelize('database', 'root', '', {
		host:'localhost',
		dialect: 'sqlite',

		//not sure exactly what this does, copying config documentation
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		},

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
	}

	//Models
	var User = require('./db/models/User')(dbConnection, tableConfig);


	//Basically check if tables exists, if not, creates it
	if (construct) {
		User.sync();
	}

	return {
		User: User
	}
}

exports.connect = connect;
exports.createSchemas = createSchemas;


;var authController = require('./controllers/authController');

function setup(app) {
	app.route('/api/users/login')
    .get(authController.login);
}

exports.setup = setup;
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


//serves the client
app.use(express.static(__dirname + '/../client/'));
// Initialize passport and passport session
// passport session invocation must be after the express sessions declaration as it is going to piggyback on that
// app.use(passport.initialize());
// app.use(passport.session());

//allows cors
app.use(cors());

//start server functions and export
var initServer = function() {
	//attachs all the routes to the server
	routes.setup(app);
	//if deployed to heroku will use heroku port, otherwise on local machine will use port 3000
	var port = process.env.port || 3000;
	var server = app.listen(port);
	//layers socket.io ontop of the express server
	console.log("Express server listening on %d in %s mode", port, app.settings.env)
}

initServer();
exports.app = app;
