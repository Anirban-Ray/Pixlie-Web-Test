const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors')
const app = express();
app.use(cors());
const dbConfig = require('./config/connection')
var connection = mysql.createConnection(dbConfig);
connection.connect();
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/hero', function(req, res) {
      console.log('received request');
      var heroName = "Hero" + Math.floor(Date.now() / 1000);
      var sql = "INSERT INTO hero (name,status,fightNo,win_score,lose_score) VALUES ('"+heroName+"','Alive',0,0,0);";
      connection.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          res.status(200).send({
          message: 'Error while performing Query.'
          });
        }else{
          var name=Math.floor(Math.random() * 10);
                      // imgURL: "http://localhost:3000/public/"+name+".png",
          res.status(200).send({
            heroName: heroName,
            imgURL: "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png",
            message: 'success'
          });
        }
      });
});
app.post('/fight', function(req, res) {
    console.log('received request');
    connection.query("SELECT * FROM hero WHERE status='Alive'", function (err, result, fields) {
       if (err){
         console.log(err);
       }else {
          if(result.length>1){
            var hero1 = result[Math.floor(Math.random()*result.length)];
            var hero2 = result[Math.floor(Math.random()*result.length)];
            while(hero1.name===hero2.name){
              hero2 = result[Math.floor(Math.random()*result.length)];
            }
            res.status(200).send({
              hero1Name:hero1.name,
              hero12Name:hero2.name,
              imgURL: "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png",
              message: 'success'
            });
          }else{
            res.status(200).send({
              message: 'Only one hero alive.'
            });
          }
       }

    });
});
app.get('/winner', function(req, res) {
  console.log('received request');
  connection.query("SELECT * FROM hero WHERE name='"+req.query.winner_name+"'", function (err, result, fields) {
     if (err){
       console.log(err);
     }else {
       connection.query("UPDATE hero SET fightNo= "+(parseInt(result[0].fightNo)+1)+",win_score="+(parseInt(result[0].win_score)+1)+" WHERE name='"+req.query.winner_name+"'", function (err, result, fields) {
          if (err){
            console.log(err);
          }else {
            connection.query("SELECT * FROM hero WHERE name='"+req.query.loser_name+"'", function (err, result, fields) {
               if (err){
                 console.log(err);
               }else {
                 connection.query("UPDATE hero SET status='Dead', fightNo= "+(parseInt(result[0].fightNo)+1)+",lose_score="+(parseInt(result[0].lose_score)+1)+" WHERE name='"+req.query.loser_name+"'", function (err, result, fields) {
                    if (err){
                      console.log(err);
                    }else {
                      res.status(200).send({
                        message: 'success'
                      });
                    }
                 });
               }

            });
          }
       });
     }

  });
});
app.post('/heroList', function(req, res) {
  console.log("received request");
  connection.query("SELECT * FROM hero WHERE status='Alive'", function (err, result, fields) {
     if (err){
       console.log(err);
     }else {
          res.status(200).send({
            result:result,
            imgURL: "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png",
            message: 'success'
          });
     }

  });
});
app.post('/champion', function(req, res) {
  console.log("received request");
  connection.query("SELECT * FROM hero WHERE status='Alive'", function (err, result, fields) {
     if (err){
       console.log(err);
     }else {
       console.log(result.length);
       if(result.length>1){
         res.status(200).send({
           length:result.length,
           message: 'unsuccess'
         });
       }else{
         res.status(200).send({
           name:result[0].name,
           message: 'success'
         });
       }

     }

  });
});
module.exports = app;
