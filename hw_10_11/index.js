var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mssql = require('mssql');
var connection = require('./config'); 

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'data', 'table'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/styles', express.static(path.join(__dirname, 'data', 'styles')));


app.get('/:page.css', function (req, res) {
    var page = req.params.page || 'main';
    var cssPath = path.join(__dirname, '/data/styles', page + '.css');

    res.sendFile(cssPath, function (err) {
        if (err) {
            res.status(404).send('CSS file not found');
        }
    });
});

app.get('/:page?', function (req, res) {
    var page = req.params.page || 'main';
    var filePath = path.join(__dirname, '/data/', page, page + '.html');

    console.log(filePath);

    res.sendFile(filePath, function (err) {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
});

app.post('/register', function (req, res) {
    var userData = {
        login: req.body.login,
        name: req.body.name,
        password: req.body.password,
        confPassword: req.body['conf-password']
    };

    if (userData.password !== userData.confPassword) {
        return res.status(400).send('Passwords do not match');
    }

    delete userData.confPassword;

    var checkUserLogin = new mssql.PreparedStatement(connection);
    checkUserLogin.input('login', mssql.NVarChar);

    var checkLoginQuery = `
        SELECT login FROM Users WHERE login = @login
        UNION
        SELECT login FROM Admins WHERE login = @login
    `;

    checkUserLogin.prepare(checkLoginQuery, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Error preparing query');
        }

        checkUserLogin.execute({ login: userData.login }, function (err, result) {

            if (result.recordset.length > 0) {
                return res.status(400).send('Login already exists');
            }

            var ps = new mssql.PreparedStatement(connection);
            ps.input('login', mssql.Text);
            ps.input('name', mssql.Text);
            ps.input('password', mssql.Text);

            ps.prepare("INSERT INTO Users (login, name, password) VALUES (@login, @name, @password)", function (err) {
                if (err) {
                    console.log(err);
                }

                ps.execute(userData, function (err) {
                    if (err) {
                        console.log(err);
                    }

                    console.log('User registered successfully');
                    ps.unprepare();
                    res.redirect('/main');
                });
            });
        });
    });
});

app.post('/login', function (request, response) {
    var loginData = {
        login: request.body.login,
        password: request.body.password
    };

    var ps = new mssql.PreparedStatement(connection);

    ps.input('login', mssql.NVarChar);
    ps.input('password', mssql.NVarChar);

    var loginQuery = `
        SELECT 'user' AS userType FROM Users WHERE CAST(login AS NVARCHAR(MAX)) = @login AND CAST(password AS NVARCHAR(MAX)) = @password
        UNION
        SELECT 'admin' AS userType FROM Admins WHERE CAST(login AS NVARCHAR(MAX)) = @login AND CAST(password AS NVARCHAR(MAX)) = @password
    `;

    ps.prepare(loginQuery, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Error preparing query');
        }

        ps.execute(loginData, function (err, result) {

            if (result.recordset.length > 0) {
                var userType = result.recordset[0].userType;
                if (userType === 'admin') {
                    var userQuery = "SELECT name, login, password FROM Users";

                    var userPs = new mssql.PreparedStatement(connection);
                    userPs.prepare(userQuery, function (err) {
                        
                        userPs.execute({}, function (err, userResult) {
                            if (err) {
                                console.log(err);
                            }

                            var users = userResult.recordset;

                            response.render('table', { users: users });
                            userPs.unprepare();
                        });
                    });
                } else {
                    response.redirect('/main');
                }
            } else {
                response.status(401).send('Invalid login or password');
            }

            ps.unprepare();
        });
    });
});




app.listen(8080, function () {
    console.log('Server started on port: 8080');
});
