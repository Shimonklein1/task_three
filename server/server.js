const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));



const conn = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mymeetings',
});

conn.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to MySQL");
    }
});

app.get('/api/teams', (req, res) => {
    const sql = 'SELECT * FROM teams';
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
});
app.get('/api/meetings', (req, res) => {
    const sql = 'SELECT * FROM meetings WHERE team_id =' + req.query.team_id;
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/meetings', (req, res) => {
    const { team_id, start, end, description, meeting_room } = req.body;
    const sql = `INSERT INTO meetings (team_id, start, end, description, meeting_room) VALUES(${team_id},'${start}','${end}','${description}','${meeting_room}')`
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.listen(3030, () => {
    console.log('Server is running on port 3030');
});