const express = require('express');
const pool = require('./database');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'soirislife42';

const app = express();
const usersOnline = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('chatapp/build'));
app.post('/chatMessages', (req, res) => {
    pool.query('(SELECT * FROM chat_msg ORDER BY id DESC LIMIT ?) ORDER BY id ASC', [req.body.limit], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});
app.post('/connection', (req, res) => {
    if (req.body.login) {
        const pass = req.body.password;
        const user = req.body.username;

        if (pass !== '' && user !== '') {
            const sql = 'SELECT * FROM chat_users WHERE username = ?';
            pool.query(sql, [user], (sel_err, sel_res) => { if (sel_err) throw sel_err;
                if (sel_res.length > 0) {
                    bcrypt.compare(pass, sel_res[0].passwd, (pass_err, pass_res) => { if (pass_err) throw pass_err;
                        if (pass_res) {
                            const token = jwt.sign({ username: user }, secret, { expiresIn: '24h' });
                            res.send({
                                success_login: true,
                                message: 'Authentication successful!',
                                token
                            });
                        } else {
                            res.send({ error: { err_pass: 'wrong password' }});
                        }
                    })
                } else {
                    res.send({ error: { err_user: 'user not found' }});
                }
            })
        } else {
            res.send({ error: { err_user: 'invalid username' }});
        }
    } else if (req.body.login === false) {
        const pass = req.body.password;
        const user = req.body.username;

        if (!user || user.length < 4 || user.lenth > 25) {
            res.send({ error: { err_user: 'requires 4 to 25 chars'}});
        } else if (!pass || pass.length < 8) {
            res.send({ error: { err_pass: 'requires over 7 chars'}});
        } else {
            pool.getConnection((con_err, con) => { if (con_err) throw con_err;
                const sql = 'SELECT * FROM chat_users WHERE username = ?';
                con.query(sql, [user], (sel_err, sel_res) => { if (sel_err) throw sel_err;
                    if (sel_res.length === 0) {
                        bcrypt.hash(pass, 10, (hash_err, hash) => { if (hash_err) throw hash_err;
                            const sql = 'INSERT INTO chat_users SET ?';
                            const data = { username: user, passwd: hash };
                            con.query(sql, data, (ins_err) => {
                                con.release();
                                if (ins_err) throw (ins_err);
                                res.send({ success_signup: true });
                            })
                        })
                    }
                })
            })
        }
    } else {
        res.end('Invalid request' );
    }
})
app.post('/getUsersOnline', (_, res) => {
    res.send({ online: usersOnline });
})

server = app.listen(3000, function() {
    console.log('server is running on port 3000');
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
});

io.on('connection', (socket) => {
    socket.on('sendMessage', function(data) {
        if (data.token) {
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

    socket.on('userConnected', function(data) {
        usersOnline.push(data.username);
        io.emit('addOnlineUser', data);
    })

    socket.on('userDisconnected', function(data) {
        usersOnline.splice(usersOnline.indexOf(data.username), 1);
        io.emit('removeOnlineUser', data);
    })
});