var express = require('express');
var app = express();
var port = 8080;
var mssql = require('mssql');

var config = {
    user: 'user32',
    password: 'hello',
    server: 'DESKTOP-N69P0E7',
    database: 'Library',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
};

app.get('/', function (req, res) {
    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {
        var request = new mssql.Request(connection);
        request.query('SELECT Name, Pages, YearPress FROM Books', function (err, result) {
            res.json(result.recordset);
            connection.close();
        });
    });
});

app.get('/teachers', function (req, res) {
    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {
        var request = new mssql.Request(connection);
        request.query('SELECT FirstName, LastName FROM Teachers', function (err, result) {
            res.json(result.recordset);
            connection.close();
        });
    });
});

app.get('/faculties', function (req, res) {
    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {

        var request = new mssql.Request(connection);
        request.query('SELECT Name FROM Faculties', function (err, result) {
            res.json(result.recordset);
            connection.close();
        });
    });
});

const authors = express.Router();

authors.route("/:param").get(function (req, res) {
    var param = parseInt(req.params.param);

    if (isNaN(param)) {
        return res.status(400).send('Invalid parameter');
    }

    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {
        var ps = new mssql.PreparedStatement(connection);
        ps.input('param', mssql.Int);

        ps.prepare('SELECT Name, Pages, YearPress FROM Books WHERE Id_Author = @param', function (err) {
            ps.execute({ param: param }, function (err, result) {
                res.json(result.recordset);
                ps.unprepare();
            });
        });
    });
});

app.use("/authors", authors);

const publishers = express.Router();

publishers.route("/:param").get(function (req, res) {
    var param = parseInt(req.params.param);

    if (isNaN(param)) {
        return res.status(400).send('Invalid parameter');
    }

    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {

        var ps = new mssql.PreparedStatement(connection);
        ps.input('param', mssql.Int);

        ps.prepare('SELECT Name, Pages, YearPress FROM Books WHERE Id_Press = @param', function (err) {

            ps.execute({ param: param }, function (err, result) {
                res.json(result.recordset);
                ps.unprepare();
            });
        });
    });
});

app.use("/publishers", publishers);

const students = express.Router();

students.get('/', function (req, res) {
    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {

        var request = new mssql.Request(connection);
        request.query('SELECT FirstName, LastName FROM Students', function (err, result) {
            res.json(result.recordset);
            connection.close();
        });
    });
});

students.route("/:param").get(function (req, res) {
    var param = parseInt(req.params.param);

    if (isNaN(param)) {
        return res.status(400).send('Invalid parameter');
    }

    var connection = new mssql.ConnectionPool(config);

    connection.connect(function (err) {
        var ps = new mssql.PreparedStatement(connection);
        ps.input('param', mssql.Int);

        ps.prepare('SELECT FirstName, LastName, Groups.Name FROM Students, Groups WHERE @param = Groups.Id', function (err) {

            ps.execute({ param: param }, function (err, result) {
                res.json(result.recordset);
                ps.unprepare();
            });
        });
    });
});

app.use("/students", students);

app.listen(port, function () {
    console.log('App listening on port ' + port);
});
