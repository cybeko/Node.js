var mssql = require('mssql'); 
var queries = require('./queries'); 

module.exports = {
	loadEditPage: function(req, res) {
		queries.loadStudentById(req, res); 
	}, 
	changeItem: function(req, res) {
		queries.updateStudent(req, res); 
	}, 
	removeItem: function(req, res) {
		queries.deleteStudent(req, res); 
	}
}
