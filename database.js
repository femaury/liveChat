const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'local',
    password: 'local',
    database: 'soir'
});

const chatQuery = 'CREATE TABLE IF NOT EXISTS chat_msg ( \
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, \
    username VARCHAR(25) NOT NULL, \
    time TINYTEXT NOT NULL, \
    text TEXT NOT NULL)';

const userQuery = 'CREATE TABLE IF NOT EXISTS chat_users ( \
    user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, \
    username VARCHAR(25) UNIQUE NOT NULL, \
    passwd VARCHAR(500) NOT NULL)';

pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(userQuery, (err) => { if (err) throw err
        connection.query(chatQuery, (err) => {        
            connection.release();
            if (err) throw err;
        });
    });
})

module.exports = pool;