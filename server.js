var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.get('/', function(req, res){
  res.render('index');
});


 var port = process.env.PORT || 3000;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });