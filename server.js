const express = require('express');
const pool = require('./database');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'soirislife42';

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
app.post('/connection', (req, res) => {
    console.log(req.body);
    if (req.body.login) {
        const pass = req.body.password;
        const user = req.body.username;

        if (pass !== '' && user !== '') {
            const sql = 'SELECT * FROM chat_users WHERE user_name = ?';
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
                const sql = 'SELECT * FROM chat_users WHERE user_name = ?';
                con.query(sql, [user], (sel_err, sel_res) => { if (sel_err) throw sel_err;
                    if (sel_res.length === 0) {
                        bcrypt.hash(pass, 10, (hash_err, hash) => { if (hash_err) throw hash_err;
                            const sql = 'INSERT INTO chat_users SET ?';
                            const data = { user_name: user, passwd: hash };
                            con.query(sql, data, (ins_err) => {
                                con.release();
                                if (ins_err) throw (ins_err);
                                res.send({ success_signup: true });
                                console.log('success');
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
app.post('/sendMessage', (req, res) => {

    const token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                var sql = 'INSERT INTO chat (user_name, time, text) VALUES (?, ?, ?)'
                var inserts = [req.body.username, req.body.time, req.body.text];
                pool.query(sql, inserts, (err) => { if (err) throw err });
                res.send({
                    success: true,
                    message: 'Message sent!'
                });
            }
        });
    } else {
        return res.send({
            success: false,
            message: 'No auth token supplied'
        });
    }
})

server = app.listen(3000, function() {
    console.log('server is running on port 3000');
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
});

io.on('connection', (socket) => {
    socket.on('sendMessage', function(data) {
        io.emit('receiveMessage', data);

        // var sql = 'INSERT INTO chat (user_name, time, text) VALUES (?, ?, ?)'
        // var inserts = [data.user_name, data.time, data.text];
        // pool.query(sql, inserts, (err) => { if (err) throw err });
    });

    socket.on('userConnected', function(data) {
        io.emit('userAuth', data);
    })
});