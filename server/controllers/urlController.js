var basicScraper = require('./basicScraperController');
var db = require("../db");




module.exports = {
  getUrls: function (req, res, next) {
    console.log('get Urls');

  //get the current user
    //user DNE --> send to login page
  //get the user's urls
    //if null, send empty array
    //send array of urls  
  },
  addUrl: function (req, res, next) {
    console.log('post Urls');
    var email = req.session.email;
    console.log('email - '+ email);
    // var url = req.url;

    // db.User.findOne({
    //   where: {
    //     email: user.email
    //   }
    // })
    // .then(function (userFound) {
    //   if (userFound) {
    //     db.Url.findOne({
    //       where: {}
    //     })


    //     // userFound.comparePasswords(user.password, function (result) {
    //     //   if (result) {
    //     //     req.session.email = userFound.email;
    //     //     res.status(200).json(userFound);
    //     //   }else{
    //     //     res.status(401).json({error: 'User or Password invalid'});
    //     //   }
    //     // });


    //   } else {
        
    //     res.status(401).json({error: 'Error - user does not exist'});
    //   }
    // });


//get the url, html & selector
  //check if the values exist
  //if does not exist
  //return an request to re-attempt the request
//get the current user
  //user DNE --> send to login page
//create a new url
  //return an request to re-attempt the request
//add the url to the user
  //return a request to re-attempt the request
//send the updated urls to the client
  },
  modifyUrl: function(req, res, next){

  },

  getExternalUrl: function(req,res, next){
    var url = req.body.url;
    console.log(req.body.url);
    basicScraper.get(url, function(error, response, html){
      if(!error && response.statusCode === 200){
        console.log('success');
        res.send(html);
      } else {
        console.log('failure');
        res.send("error no response");
      }
    });
  }
};
