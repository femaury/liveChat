const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('./database');
const jwt = require('jsonwebtoken');

const secret = 'localtestingsecret';

router.use('/', (req, res) => {
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

module.exports = router;