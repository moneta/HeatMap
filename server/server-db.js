var url = require('url');
var mongoose = require('mongoose');
var	nconf = require('nconf');

mongoose.Promise = global.Promise;

nconf.argv()
  .env()
  .file({ file: 'db-config.json' });

var dbConfig = nconf.get();

var myDB = {
	dbname : dbConfig.db,

	connect: () => {
	  var connString = 'mongodb://' + dbConfig.user + ':' + dbConfig.password + '@' + dbConfig.hostname + ':' + dbConfig.port + '/' + dbConfig.db;
		var conn = mongoose.connect(connString, (err) => {
			if(err){
				console.error('Connection had errors: ', err.code);
				console.error('Connection params used: hostname = ' +  dbConfig.hostname + ', username = ' + dbConfig.user + ', db = '+  dbConfig.db );
				process.exit(1);
			}
		});

		if (conn) {
		  // console.log(conn);
		  mongoose.connection.on('connected', function () {
        console.log('Mongoose default connection open to ' + connString);
      });

      // If the connection throws an error
      mongoose.connection.on('error',function (err) {
        console.log('Mongoose default connection error: ' + err);
      });

      // When the connection is disconnected
      mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
      });

      // If the Node process ends, close the Mongoose connection
      process.on('SIGINT', function() {
        mongoose.connection.close(function () {
          console.log('Mongoose default connection disconnected through app termination');
          process.exit(0);
        });
      });
		}

		return conn;
	},

	disconnect : function(conn){
		conn.end();
	},

//	debugError: function(fn, error){
//		// Generate SOFT error, instead of throwing hard error.
//		// We send messages with debug ingo only if in development mode
//
//		if(global.App.mode === 'development'){
//			fn({message: {
//				text: 'Database error',
//				debug: error
//			}
//			});
//		} else {
//			fn({message: {
//				text: 'Unknown error',
//				debug: null
//			}
//			});
//		}
//	}
};


//
//myDB.DB_query = function(conn, sql, params, debugMessage, dbType, callback) { //errorMessage,debugMessage,transaction,trapErrors,&err_no,&_err_msg,dbType){
//
//	//if(typeof errorMessage === 'undefined') errorMessage = "";
//	if(typeof debugMessage === 'undefined') debugMessage = "SQLError: ";
//	//if(typeof transaction === 'undefined') transaction = false;
//	//if(typeof _err_no === 'undefined') _err_no = 0;
//	//if(typeof _err_msg === 'undefined') _err_msg = "";
//	if(typeof dbType === 'undefined') dbType = "MySQL";
//
//	result = false;
//
//		conn.query(sql, params, function(err, rows, field) {
//			if (err) {
//				console.log(err);
//			}
//
//			callback(err, rows, field);
//		});
//
//
//	//return $result;
//
//}
//
//
//
//
//myDB.DB_data_get_field = function(field_name,table,where,db,dbType,callback){
//
//	if(typeof dbType === 'undefined') dbType = "MySQL";
//
//	if(dbType == "MySQL") {
//		var conn = db.connect();
//
//		sql =	" SELECT " + field_name +
//				" FROM " + table +
//				" WHERE " + where;
//
//		db.DB_query(conn, sql, null, 'Error on myDB.DB_data_get_field > SQL = ', "MySQL", function(err, rows, fields) {
//			db.disconnect(conn); //release connection
//			if (err) {
//				callback(err);
//			} else {
//				if(rows.length  == 0) {
//					callback(err, null);
//				} else if(rows.length == 1) {
//					callback(err, rows[0][field_name]);
//				} else {
//					// TO DO
//					// Should I return the array of values here ?
//					callback(err, rows[0][field_name]);
//				}
//			}
//		});
//	} else {
//		callback({errno: 0, errMsg: "Not implement yet"},null);
//	}
//} // GetFieldFromCode
//

//test db connection and terminate if connection fails
myDB.connect();

// Make MySql connections available globally, so we can access them from within modules
//Store inside database property of App
global.App.database = myDB;