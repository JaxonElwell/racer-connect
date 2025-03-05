const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// middleware
app.use(cors());
app.use(express.json());

// database setup
const db = new sqlite3.Database('./devdb.sqlite', (err) => {
    if(err) {
        constole.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// API endpoints
app.get('/api/EventAttendees', (req, res) => {
    db.all('SELECT * FROM StudentOrganizations', [], (err, rows) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

app.get('/api/Events', (req, res) => {
    db.all('SELECT * FROM StudentOrganizations', [], (err, rows) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

app.get('/api/StudentOrganizations', (req, res) => {
    db.all('SELECT * FROM StudentOrganizations', [], (err, rows) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

app.get('/api/Users', (req, res) => {
    db.all('SELECT * FROM StudentOrganizations', [], (err, rows) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log('Server running on http://localhost:5000');
});