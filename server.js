const express = require('express');
const pool = require('./database');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('chatapp/build'));
app.post('/chatMessages', (req, res) => {
    pool.query('(SELECT * FROM chat ORDER BY id DESC LIMIT ?) ORDER BY id ASC', [req.body.limit], (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});

server = app.listen(3000, function() {
    console.log('server is running on port 3000');
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
});

io.on('connection', (socket) => {
    socket.on('sendMessage', function(data) {
        io.emit('receiveMessage', data);

        var sql = 'INSERT INTO chat (user_name, time, text) VALUES (?, ?, ?)'
        var inserts = [data.user_name, data.time, data.text];
        pool.query(sql, inserts, (err) => { if (err) throw err });
    });
});