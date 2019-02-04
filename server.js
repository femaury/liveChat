const express = require('express');

const app = express();

app.use('/', express.static('chatapp/build'));

server = app.listen(3000, function() {
    console.log('server is running on port 3000');
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
});

io.on('connection', (socket) => {
    socket.on('sendMessage', function(data) {
        io.emit('receiveMessage', data);
    });
});