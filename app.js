const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('movies.sqlite');

const express = require('express')
const bodyParser = require('body-parser');

const app = express()

app.use(express.static('./public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/movies/:movieId', (req, res) => {
    const q = `select * from movies where movieId = ${req.params.movieId}`;
    db.all(q, (err, rows) => {
        if (err) {
            res.json({ 'message': 'failure', 'code': err });
            console.error(err);
            return;
        }
        res.type('json').send(JSON.stringify(rows, null, 2) + '\n');
    });
});

app.get('/ratings/:userId', async (req, res) => {
    const q = `select * from ratings where userId = ${req.params.userId}`;
    db.all(q, (err, rows) => {
        if (err) {
            res.json({ 'message': 'failure', 'code': err });
            console.error(err);
            return;
        }
        res.type('json').send(JSON.stringify(rows, null, 2) + '\n');
    });
});

app.post('/view', (req, res) => {
    var keyword = req.body.keyword;
    const q = `select * from movies where title LIKE '%${req.body.keyword}%' `;
    db.all(q, (err, rows) => {
        if (err) {
            res.json({ 'message': 'failure', 'code': err });
            console.error(err);
            return;
        }
        res.type('json').send(JSON.stringify(rows, null, 2) + '\n');

    });
});

app.listen(8080, function () {
    console.log("App listening on port: 8080");
});

var request = require('request');

function query(q) {
    return new Promise(function (resolve, reject) {
        db.all(q, (err, rows) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}