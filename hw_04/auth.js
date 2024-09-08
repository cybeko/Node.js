var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

http.createServer(function (req, res) {
    var parsedUrl = url.parse(req.url).pathname;

    var filePath = 'page' + parsedUrl;
    if (filePath === 'page/') {
        filePath = 'page/index.html';
    }

    var extname = path.extname(filePath);
    var contentType = 'text/html';

    if (extname === '.css') {
        contentType = 'text/css';
    }

    fs.readFile(filePath, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found!');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });

}).listen(8080, function () {
    console.log('Server running on port 8080');
});