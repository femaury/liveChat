const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./database');
const jwt = require('jsonwebtoken');

const chatConnection = require('./connection');

require('./botross');

const app = express();
const onlineUsers = new Map();
const secret = 'localtestingsecret';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('client/build'));
app.use('/chatConnection', chatConnection);

app.post('/chatMessages', (req, res) => {
    pool.query('(SELECT * FROM chat_msg ORDER BY id DESC LIMIT ?) ORDER BY id ASC', [req.body.limit], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});
app.post('/getOnlineUsers', (_, res) => {
	res.send({ online: Array.from(onlineUsers.values()) });
})

server = app.listen(3000, function() {
    console.log('server is running on port 3000');
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
});

io.on('connection', (socket) => {

    const updateOnlineUsers = (left) => {
        const joined = onlineUsers.get(socket.id);

        if (joined)
            io.emit('receiveMessage', { username: 'CO', time: null, text: joined + ' has joined the chat!'  });
        else if (left)
            io.emit('receiveMessage', { username: 'CO', time: null, text: left + ' has left the chat.' });
        io.emit('updateOnlineUsers', { online: Array.from(onlineUsers.values()) });
    }

    socket.on('sendMessage', function(data) {
        if (data.token && data.text.length < 65000) {
            jwt.verify(data.token, secret, (err, decoded) => {
                if (!err) {
                    var sql = 'INSERT INTO chat_msg (username, time, text) VALUES (?, ?, ?)'
                    var inserts = [decoded.username, data.time, data.text];
                    pool.query(sql, inserts, (err) => { if (err) throw err });
                    data.username = decoded.username;
                    io.emit('receiveMessage', data);
                }
            });
        }
    });

    socket.on('userTyping', function() {
        const username = onlineUsers.get(socket.id);
        if (username)
            io.emit('updateTyping', { username });
    })

    socket.on('userConnected', function(data) {
        onlineUsers.set(socket.id, data.username);
        updateOnlineUsers(null);
    })

    socket.on('userDisconnected', function(data) {
        const left = onlineUsers.get(socket.id);
        onlineUsers.delete(socket.id);
        updateOnlineUsers(left);
    })

    socket.on('disconnect', function() {
        const left = onlineUsers.get(socket.id);
        onlineUsers.delete(socket.id);
        updateOnlineUsers(left);
    })
});
