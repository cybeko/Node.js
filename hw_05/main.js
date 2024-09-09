var http = require('http'); 
var fs = require('fs'); 
var url = require('url');
var path = require('path'); 

var port = 8080;

var server = http.createServer(function(req, res) {

    req.on('error', function (err) {
        console.log(err);
    }); 

    if (req.url == "/") {

        var file_path = path.join(__dirname, 'index.html');
        fs.readFile(file_path, function (err, data) { 

            if (err) {
                console.log(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('Not Found!');

            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' }); 
                res.write(data.toString());
            }

            res.end();
        });

    } 
    else if (req.url == "/style.css") {
        var css_path = path.join(__dirname, 'style.css');
        fs.readFile(css_path, function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('CSS file not found!');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.write(data.toString());
            }
            res.end();
        })}
    
    else if (req.url == "/data") {
        var body = '';

        req.on('data', function (mydata) {
            body += mydata;
        });

        req.on('end', function () {
            var data = JSON.parse(body);

            fs.appendFile('userData.txt', JSON.stringify(data) + '\n', function (err) {
                if (err) {
                    console.log('Error writing to file:', err);
                } else {
                    console.log('Data successfully saved!');
                }
            });


            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(data));
            res.end();

            console.log('Data received:', data);
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Resource not found'); 
    }

}).listen(port);

console.log('server running on port ' + port);