var express = require('express');
var app = express();
var mssql = require('mssql');
var connection = require('./js/config');

var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var displayHandler = require('./js/displayhandler'); 
var insertHandler = require('./js/inserthandler'); 
var editHandler = require('./js/edithandler'); 

app.set('views', __dirname + '/pages'); 
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'pages')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', function(req, res) {
    if (!req.cookies.loggedIn) {
        res.render('login');
    } else {
        displayHandler.displayItems(req, res);
    }
});

app.post('/login', function(req, res) {
    var login = req.body.username;
    var password = req.body.password;
    
    var query = `SELECT * FROM Admins WHERE login = @login AND password = @password`;

    var request = new mssql.Request(connection);
    request.input('login', mssql.VarChar, login);
    request.input('password', mssql.VarChar, password);
    
    request.query(query, function(err, result) {
        if (err) {
            console.log(err);
        }
        
        if (result.recordset.length > 0) {
            res.cookie('loggedIn', true, { maxAge: 900000, httpOnly: true });
            res.redirect('/');
        } else {
            res.render('login', { message: 'Invalid credentials' });
        }
    });
});

app.get('/add', insertHandler.loadAddPage); 
app.post('/add/newItem', insertHandler.addRow); 
app.get('/edit', displayHandler.displayItems); 
app.get('/edit/:id', editHandler.loadEditPage);
app.put('/edit/:id', editHandler.changeItem);
app.delete('/edit/:id', editHandler.removeItem);

app.use(function(err, req, res, next) {
    if (err) console.log(err.stack);
    res.status(500).send('oops...something went wrong');
});

var port = 8080;
app.listen(port, function() {
    console.log('app listening on port ' + port);
});
