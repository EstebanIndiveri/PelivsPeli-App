var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'user',
  password : 'admin',
  database : 'competencias',
  charset : 'utf8'
});

module.exports = connection;
