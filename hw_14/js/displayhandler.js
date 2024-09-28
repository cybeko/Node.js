var mssql = require('mssql');

var queries = require('./queries');  

module.exports = {
    displayItems: function(req, res) {
        if (!req.cookies.loggedIn) {
            return res.redirect('/');
        }

        queries.getAllItems(req, res);
    }
};
