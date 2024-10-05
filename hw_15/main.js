var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var mssql = require('mssql');
var { dbConfig } = require('./js/session_handler');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'supersecret'
}));

app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'ejs');

var port = 8080;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', async function (req, res) {
    try {
        const pool = await mssql.connect(dbConfig);

        const username = req.body.username;
        const password = req.body.password;

        const adminQuery = 'SELECT * FROM Admins WHERE login = @username AND password = @password';
        const adminResult = await pool.request()
            .input('username', mssql.VarChar, username)
            .input('password', mssql.VarChar, password)
            .query(adminQuery);

        if (adminResult.recordset.length > 0) {
            req.session.username = username;
            console.log("Admin login succeeded: ", req.session.username);
            return res.send('Admin login succeeded: ' + req.session.username);
        }

        const userQuery = 'SELECT * FROM Users WHERE login = @username AND password = @password';
        const userResult = await pool.request()
            .input('username', mssql.VarChar, username)
            .input('password', mssql.VarChar, password)
            .query(userQuery);

        if (userResult.recordset.length > 0) {
            req.session.username = username;
            console.log("User login succeeded: ", req.session.username);
            return res.send('User login succeeded: ' + req.session.username);
        }

        console.log("Login failed: ", req.body.username);
        res.status(401).send('Login error');
    } catch (error) {
        console.error('SQL error', error);
        res.status(500).send('Server Error');
    }
});

app.get('/logout', function (req, res) {
    req.session.username = '';
    console.log('Logged out');
    res.send('Logged out');
});

app.get('/admin', function (req, res) {
    if (req.session.username === 'admin') {
        res.render('admin_page');
    } else {
        res.status(403).send('Access Denied!');
    }
});

app.get('/user', function (req, res) {
    if (req.session.username) {
        res.render('user_page');
    } else {
        res.status(403).send('Access Denied!');
    }
});

app.get('/guest', function (req, res) {
    res.render('guest_page');
});

app.listen(port, function () {
    console.log('App running on port ' + port);
});
