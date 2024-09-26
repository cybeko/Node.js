var mssql = require('mssql');

var config = {
	user: 'user32',   			
	password: 'hello', 	 		
	server: 'DESKTOP-N69P0E7', 			 
	database: 'Accounts',    		
	port: 1433,			 			
    options: {
        encrypt: true,
        trustServerCertificate: true 
    },
}

var connection = new mssql.ConnectionPool(config); 

var pool = connection.connect(function(err) {
	if (err) console.log(err)
}); 

module.exports = pool; 