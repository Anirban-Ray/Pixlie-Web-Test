const express = require('express');
const mysql= require('mysql');
const app = express();
const dbConfig = require('./config/connection')
var connection = mysql.createConnection(dbConfig);

connection.connect();

app.get('/request', function(req, res) {
  console.log('received message from knowlarity get method');
  console.log(req.query);
  res.status(200).send({
    message: 'success'
  });
});
module.exports = app;
