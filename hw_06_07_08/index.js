var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();
var productsRouter = express.Router();
var categoriesRouter = express.Router();

var requestLogPath = 'requestLog.txt';
var loginLogPath = 'loginLog.txt'; 

var usersDataPath = 'users.json';
var productsDataPath = 'products.json';
var categoriesDataPath = 'categories.json';

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next){
    var data = `Address : ${req.ip}; Time: ${new Date().toLocaleString()}; URL : ${req.url}\n`;

    fs.appendFile(requestLogPath, data, function(err){
        if (err) throw err;
    });
    next();
});

app.use(function(req, res, next) {
    if (req.path === '/login' && req.method === 'POST') {
        var loginAttemptData = {
            time: new Date().toLocaleString(),
            ip: req.ip,
            login: req.body.login,
            userAgent: req.headers['user-agent'],
            referrer: req.headers.referer,
        };
        var logData = `Login Attempt:  Time: ${loginAttemptData.time}, IP: ${loginAttemptData.ip}, Login: ${loginAttemptData.login}, User-Agent: ${loginAttemptData.userAgent}, Referrer: ${loginAttemptData.referrer}\n`;

        fs.appendFile(loginLogPath, logData, function(err) {
            if (err) throw err;
        });
    }
    next();
});

app.use('/product', productsRouter);
app.use('/category', categoriesRouter);

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

productsRouter.get('/', function (req, res) {
    fs.readFile(path.join(__dirname, productsDataPath), 'utf8', (err, data) => {
        const products = JSON.parse(data).products;
        res.json(products);
    });
});

productsRouter.get('/:id', function (req, res) {
    const productId = parseInt(req.params.id, 10); 

    fs.readFile(path.join(__dirname, productsDataPath), 'utf8', (err, data) => {

        const products = JSON.parse(data).products;
        const product = products.find(p => p.id === productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    });
});

categoriesRouter.get('/', function (req, res) {
    fs.readFile(path.join(__dirname, categoriesDataPath), 'utf8', (err, data) => {

        const categories = JSON.parse(data);
        res.json(categories);
    });
});

categoriesRouter.get('/:name', function (req, res) {
    const categoryName = req.params.name; 

    fs.readFile(path.join(__dirname, categoriesDataPath), 'utf8', (err, data) => {
        const categories = JSON.parse(data);
        const category = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());

        if (category) {
            res.json(category);
        } else {
            res.status(404).send('Category not found.');
        }
    });
});

app.post('/register', function (req, res) {
    var userData = {
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
        confPassword: req.body['conf-password']
    };

    if (userData.password !== userData.confPassword) {
        return res.status(400).send('Passwords do not match');
    }

    delete userData.confPassword;

    fs.readFile(usersDataPath, 'utf8', function (err, data) {
        var users = [];

        if (data) {
            try {
                users = JSON.parse(data);
            } 
            catch (parseError) {
                return res.status(500).send('Error parsing user data');
            }
        }

        users.push(userData);

        fs.writeFile(usersDataPath, JSON.stringify(users, null, 2), 'utf8', function (err) {
            if (err) {
                return res.status(500).send('Error writing user data');
            }
            res.send('Registered successfully');
        });
    });
});

app.post('/login', function(request, response) {
    var loginData = {
        login: request.body.login,
        password: request.body.password
    };

    fs.readFile(usersDataPath, 'utf8', function(err, data) {
        var users = [];
        try {
            users = JSON.parse(data);
        } catch (parseError) {
            return response.status(500).send('Error parsing user data');
        }

        var user = users.find(u => u.login === loginData.login);

        if (!user) {
            response.status(404).send('User not found');
        } else if (user.password !== loginData.password) {
            response.status(401).send('Invalid password');
        } else {
            response.send('Login successful');
        }
    });
});

app.listen(8080, function () {
    console.log('Server started on port: 8080');
});
