const io = require('socket.io-client');
const bob = require('bob-ross-lipsum');
 
const socket = io('http://localhost:3000');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJvdCBSb3NzIiwiaWF0IjoxNTQ5OTc5ODIwfQ.KknClinwl_Ky5gfKgdy0NMPEBJcpKVSwUR1NPb4dXXM';

function botross_send(text) {
	setTimeout(() => {
        socket.emit('sendMessage', {
            username: 'Bot Ross',
            time: '[BOT]',
            text,
            token
        });
    }, 500);
}

socket.on('connect', function() { console.log('Bot Ross connected') });

socket.on('receiveMessage', function(data) {
    const words = data.text.split(' ');
    const text = bob(4);

    if (words[0] === '!bobross') {
        botross_send(text);
    }
});

socket.on('disconnect', function() { console.log('Bot Ross disconnected') });
