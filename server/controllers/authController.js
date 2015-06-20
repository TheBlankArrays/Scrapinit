var db = require('../db');
var bcrypt = require('bcrypt');
module.exports = {
  login: function (req, res, next) {
    var user = req.body;

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
    db.User.findOne({
      where: user
    })
    .then(function (userFound) {
      if (userFound) {
        res.status(401).json({error: 'User is already taken'});
      } else {
        db.User.create(user)
        .then(function (newUser){
          res.status(201).json(newUser);
        });
      }
    });
  }
};