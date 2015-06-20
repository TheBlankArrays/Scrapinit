var db = require('../db');

module.exports = {
  login: function (req, res, next) {
    var user = req.body;
    db.User.findOne({
      where: user
    })
    .then(function (user) {
      if (user) {
        req.session.email = user.email;
        res.status(200).json(user);
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