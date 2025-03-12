const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// middleware
app.use(cors());
app.use(express.json());

// database setup
const db = new sqlite3.Database('./devdb.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// API endpoints
// GET all event attendees
app.get('/api/EventAttendees', (req, res) => {
    db.all('SELECT * FROM EventAttendees', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// GET all events
app.get('/api/Events', (req, res) => {
    db.all('SELECT * FROM Events', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// GET all organizations
app.get('/api/StudentOrganizations', (req, res) => {
    db.all('SELECT * FROM StudentOrganizations', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// GET all users
app.get('/api/Users', (req, res) => {
    db.all('SELECT * FROM Users', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// GET organization by id
app.get('/api/StudentOrganizations/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM StudentOrganizations WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal server error');
        } else if (!row) {
            res.status(404).send('Organization not found');
        } else {
            res.send(row);
        }
    });
});

// POST new organization
app.post('/api/StudentOrganizations', (req, res) => {
    const { name, category, president, president_email, advisor, advisor_email } = req.body;
    if (!name || !category) {
        res.status(400).send('name and category cannot be null');
    } else {
        const sql = 'INSERT INTO StudentOrganizations(name, category, president, president_email, advisor, advisor_email) VALUES (?, ?, ?, ?, ?, ?)';
        db.run(sql, [name, category, president, president_email, advisor, advisor_email], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal server error');
            } else {
                const id = this.lastID;
                res.status(201).send({ id, name, category, president, president_email, advisor, advisor_email });
            }
        });
    }
});

// PUT update organization by id
app.put('/api/StudentOrganizations/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, president, president_email, advisor, advisor_email } = req.body;
    if (!name || !category) {
        res.status(400).send('name and category cannot be null');
    } else {
        const sql = 'UPDATE StudentOrganizations SET name = ?, category = ?, president = ?, president_email = ?, advisor = ?, advisor_email = ? WHERE id = ?';
        db.run(sql, [name, category, president, president_email, advisor, advisor_email, id], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal server error');
            } else if (this.changes === 0) {
                res.status(404).send('Organization not found');
            } else {
                res.status(200).send({ id, name, category, president, president_email, advisor, advisor_email });
            }
        });
    }
});

// DELETE organization by id
app.delete('/api/StudentOrganizations/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM StudentOrganizations WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal server error');
        } else if (this.changes === 0) {
            res.status(404).send('Organization not found');
        } else {
            res.status(204).send();
        }
    });
});

// start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log('Server running on http://localhost:5000');
});