const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('movies.sqlite');

const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors());

app.use(express.static('./public'))

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/movies/:movieId', async (req, res)=>{
    const q = `select movieId,title,genres from movies where movieId = ${req.params.movieId}`;
    try{
        const results = await query(q);
        res.json(results);
    }catch(err){
        console.error(err);
        res.append('status', '500');
        res.send(err);
    }
});

app.get('/ratings/:userId', async (req, res)=>{
    const q = `select * from ratings where userId = ${req.params.userId}`;
    try{
        const results = await query(q);
        res.json(results);
    }catch(err){
        console.error(err);
        res.append('status', '500');
        res.send(err);
    }
});

app.post('/view', function(req,res){
    db.serialize(()=>{
      db.each('SELECT * FROM movies WHERE movieId =?', [req.body.movieId], function(err,row){     //db.each() is only one which is funtioning while reading data from the DB
        if(err){
          res.send("Error encountered while displaying");
          return console.error(err.message);
        }
        res.send(` ID: ${row.movieId},    Title: ${row.title}`);
        console.log("Entry displayed successfully");
      });
    });
});

app.listen(8080,function(){ 
    console.log("App listening on port: 8080");
});

var request = require('request');

function query(q){
    return new Promise(function(resolve, reject){
        db.all(q,(err,rows)=>{
            if(err){
                console.error(err);
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}