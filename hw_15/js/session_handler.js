var mssql = require('mssql');

var dbConfig = {
    user: 'user32',
    password: 'hello',
    server: '28-2',
    database: 'testdb',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

module.exports = {
    dbConfig
};
