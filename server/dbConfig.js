var Sequelize = require("sequelize");

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


