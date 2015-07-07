var Sequelize = require("sequelize");

//no password
var connect = function(dbPath) {
	if (process.env.NODE_ENV === 'production') {
    console.log('hiiiiiiiiiii')
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize('postgres://qwdforbgbksucc:70XlVZpfBEr9tr3zVVrlUZpV1d@ec2-54-204-27-193.compute-1.amazonaws.com:5432/db08i080rbc4jn', {
      dialect:  'postgres',
      protocol: 'postgres',
      port:     5432,
      host:     'ec2-54-204-27-193.compute-1.amazonaws.com',
      logging:  true //false
    })
  } else {
    console.log('life succkkkkss')
    // the application is executed on the local machine ... use mysql
		var sequelize = new Sequelize('scrapinit', 'scrapinit', '123456', {
			dialect: 'postgres',
			port:    5432,
			// use pooling in order to reduce db connection overload and to increase speed
			// currently only for mysql and postgresql (since v1.5.0)
			//not sure exactly what this does, copying config documentation
			// pool: {
			// 	max: 5,
			// 	min: 0,
			// 	idle: 10000
			// },

			// storage: dbPath,
			logging: console.log,
	    logging: function (str) {
	      console.log('Query: ', str);
	    }
		});
  }

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
		// User.sync();
  //   UserUrl.sync();
  //   Url.sync();
    User.sync()
    .then(function () {
      Url.sync()
      .then(function () {
        UserUrl.sync();
      });
    });  
	}

	return {
		User: User,
		Url: Url,
		UserUrl: UserUrl
	}
};

exports.connect = connect;
exports.createSchemas = createSchemas;


