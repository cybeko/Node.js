var mssql = require('mssql');
var queries = require('./queries');

module.exports = {
    displayStudents: function(req, res) {
        queries.getAllStudents(req, res);
    }
};
