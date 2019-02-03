const express = require('express');
const socket = require('socket.io');

const app = express();

app.use('/', express.static('chatapp/build'));

server = app.listen(3000, function() {
    console.log('server is running on port 3000');
});

io = socket(server);

io.on('connection', (socket) => {
    socket.on('sendMessage', function(data) {
        io.emit('receiveMessage', data);
    });
});