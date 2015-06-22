var db = require('../db');
var bcrypt = require('bcrypt');
module.exports = {
  login: function (req, res, next) {

    var user = req.body;

    console.log("logging in as " + user);
    db.User.findOne({
      where: {
        email: user.email
      }
    })
    .then(function (userFound) {
      if (userFound) {
        userFound.comparePasswords(user.password, function (result) {
          if (result) {
            req.session.email = userFound.email;
            res.status(200).json(userFound);
          }else{
            res.status(401).json({error: 'User or Password invalid'});
          }
        });
      } else {
        res.status(401).json({error: 'User or Password invalid'});
      }
    });
  },

  signup: function (req, res, next) {
    var user = req.body;
    db.User.create(user)
    .then(function (newUser){
      res.status(201).json(newUser);
    })
    .catch(function (err) {
      res.status(403).json({message: err.message});
    });
  },

  checkUser: function(req, res, next) {
    var isLoggedIn = !!req.session.email;
    console.log('checking user');
    res.send(isLoggedIn);
  },

  logout: function(req, res, next) {
    req.session.email = null;
    res.send('Logout successful');
  }

};
