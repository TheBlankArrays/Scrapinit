var express = require('express');
var app = express();
// run the sqlite
var db = require('./db');
// middleware that automatically logs responses, requests, and associated data
// var logger = require('morgan');
var routes = require('./routes');
var parser = require('body-parser');
var session = require('express-session');
var cors = require('cors');

/** allows the server to automatically process urlencoded stuff into a javscript object
*   if we decided to pass JSON to the server instead we'll need to change this to parser.JSON()
*  app.use(logger('combined'));
*/
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
// set up sessions
app.use(session({
	secret: 'scrapinit top secret',
	resave: false,
	saveUninitialized: false
}));


// serves the client
app.use(express.static(__dirname + '/../client/'));

// allows cors
app.use(cors());

// start server functions and export
var initServer = function() {
	// attachs all the routes to the server
	routes.setup(app);
	// if deployed to heroku will use heroku port, otherwise on local machine will use port 3000
	var port = process.env.port || 3000;
	var server = app.listen(port);
	// layers socket.io ontop of the express server
	console.log("Express server listening on %d in %s mode", port, app.settings.env)
}

initServer();
exports.app = app;
