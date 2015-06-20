var express = require('express');
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
