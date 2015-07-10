var Sequelize = require("sequelize");

//no password
var connect = function(dbPath) {
  var sequelize = new Sequelize('database', 'root', '', {
    host:'localhost',
    dialect: 'sqlite',

    // use pooling in order to reduce db connection overload and to increase speed
    // currently only for mysql and postgresql (since v1.5.0)
    //not sure exactly what this does, copying config documentation
    // pool: {
    //  max: 5,
    //  min: 0,
    //  idle: 10000
    // },

    storage: dbPath,
    logging: console.log,
    logging: function (str) {
      // console.log('Query: ', str);
    }
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
  User.belongsToMany(Url, { through: UserUrl });
  Url.belongsToMany(User, { through: UserUrl });

  User.hasMany(UserUrl);
  UserUrl.belongsTo(User);

  Url.hasMany(UserUrl);
  UserUrl.belongsTo(Url);


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

