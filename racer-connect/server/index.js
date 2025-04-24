const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./auth');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use(express.json());

app.use(express.static('src')); 

// OAuth Keys
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
   saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

// database setup
const db = new sqlite3.Database('./devdb.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

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

// GET all events with pagination
app.get('/api/EventsPaginated', (req, res) => {
    const page = parseInt(req.query.page) || 0; // Default to page 0
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const search = req.query.search;
    const offset = page * limit;

    const sql = 'SELECT * FROM Events WHERE name LIKE ? LIMIT ? OFFSET ?';
    db.all(sql, [search, limit, offset], (err, rows) => {
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

// GET all organizations with pagination
app.get('/api/StudentOrganizationsPaginated', (req, res) => {
    const page = parseInt(req.query.page) || 0; // Default to page 0
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const search = req.query.search;
    const offset = page * limit;

    const sql = 'SELECT * FROM StudentOrganizations WHERE name LIKE ? LIMIT ? OFFSET ?';
    db.all(sql, [search, limit, offset], (err, rows) => {
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

// POST route to handle CSV upload for StudentOrganizations
app.post('/api/UploadStudentOrganizations', upload.single('file'), (req, res) => {
    const filePath = req.file.path;

    const organizations = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            organizations.push(row);
        })
        .on('end', () => {
            const sql = `
                INSERT INTO StudentOrganizations (name, category, president, president_email, advisor, advisor_email)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.serialize(() => {
                organizations.forEach((org) => {
                    db.run(sql, [org.name, org.category, org.president, org.president_email, org.advisor, org.advisor_email], (err) => {
                        if (err) {
                            console.error('Error inserting organization:', err.message);
                        }
                    });
                });
            });

            db.close();
            fs.unlinkSync(filePath); // Delete the uploaded file
            res.status(200).send('File processed successfully.');
        })
        .on('error', (err) => {
            console.error('Error processing CSV file:', err.message);
            res.status(500).send('Failed to process file.');
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

// POST new event
app.post('/api/Events', (req, res) => {
    const { organization_id, name, event_date, location, description, image } = req.body;
    if (!organization_id || !name || !event_date || !location) {
        res.status(400).send('organization_id, name, event_date, and location cannot be null');
    } else {
        const sql = 'INSERT INTO Events(organization_id, name, event_date, location, description, image) VALUES (?, ?, ?, ?, ?, ?)';
        db.run(sql, [organization_id, name, event_date, location, description, image], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal server error');
            } else {
                const id = this.lastID;
                res.status(201).send({ id, organization_id, name, event_date, location, description, image });
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

// PUT update event by id
app.put('/api/Events/:id', (req, res) => {
    const { id } = req.params;
    const { organization_id, name, event_date, location, description, image } = req.body;
    if (!organization_id || !name || !event_date || !location) {
        res.status(400).send('name and category cannot be null');
    } else {
        const sql = 'UPDATE Events SET organization_id = ?, name = ?, event_date = ?, location = ?, description = ?, image = ? WHERE id = ?';
        db.run(sql, [organization_id, name, event_date, location, description, image, id], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal server error');
            } else if (this.changes === 0) {
                res.status(404).send('Event not found');
            } else {
                res.status(200).send({ id, organization_id, name, event_date, location, description, image });
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

// DELETE event by id
app.delete('/api/Events/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Events WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal server error');
        } else if (this.changes === 0) {
            res.status(404).send('Event not found');
        } else {
            res.status(204).send();
        }
    });
});

// GET all events a user is registered for
app.get('/api/UserEvents/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT e.*
        FROM Events e
        JOIN UserEvents ue ON e.id = ue.event_id
        WHERE ue.user_id = ?
    `;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching user events:', err.message);
            res.status(500).send('Failed to fetch user events');
        } else {
            res.status(200).json({ events: rows });
        }
    });
});

// POST - Register a user for an event
app.post('/api/UserEvents', (req, res) => {
    const { user_id, event_id } = req.body;
    if (!user_id || !event_id) {
        return res.status(400).send('user_id and event_id are required');
    }

    const sql = `INSERT INTO UserEvents (user_id, event_id) VALUES (?, ?)`;
    db.run(sql, [user_id, event_id], function (err) {
        if (err) {
            console.error('Error registering for event:', err.message);
            res.status(500).send('Failed to register for event');
        } else {
            res.status(201).json({ message: 'User registered for event' });
        }
    });
});

// DELETE - Unregister a user from an event
app.delete('/api/UserEvents', (req, res) => {
    const { user_id, event_id } = req.body;
    if (!user_id || !event_id) {
        return res.status(400).send('user_id and event_id are required');
    }

    const sql = `DELETE FROM UserEvents WHERE user_id = ? AND event_id = ?`;
    db.run(sql, [user_id, event_id], function (err) {
        if (err) {
            console.error('Error unregistering from event:', err.message);
            res.status(500).send('Failed to unregister from event');
        } else if (this.changes === 0) {
            res.status(404).send('User was not registered for this event');
        } else {
            res.status(200).json({ message: 'User unregistered from event' });
        }
    });
});

// GET all organizations a user is part of
app.get('/api/UserOrganizations/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT o.*
        FROM StudentOrganizations o
        JOIN UserOrganizations uo ON o.id = uo.organization_id
        WHERE uo.user_id = ?
    `;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching user organizations:', err.message);
            res.status(500).send('Failed to fetch user organizations');
        } else {
            res.status(200).json({ organizations: rows });
        }
    });
});

// POST - Join an organization
app.post('/api/UserOrganizations', (req, res) => {
    const { user_id, organization_id } = req.body;
    if (!user_id || !organization_id) {
        return res.status(400).send('user_id and organization_id are required');
    }

    const sql = `INSERT INTO UserOrganizations (user_id, organization_id) VALUES (?, ?)`;
    db.run(sql, [user_id, organization_id], function (err) {
        if (err) {
            console.error('Error joining organization:', err.message);
            res.status(500).send('Failed to join organization');
        } else {
            res.status(201).json({ message: 'User joined organization' });
        }
    });
});

// DELETE - Leave an organization
app.delete('/api/UserOrganizations', (req, res) => {
    const { user_id, organization_id } = req.body;
    if (!user_id || !organization_id) {
        return res.status(400).send('user_id and organization_id are required');
    }

    const sql = `DELETE FROM UserOrganizations WHERE user_id = ? AND organization_id = ?`;
    db.run(sql, [user_id, organization_id], function (err) {
        if (err) {
            console.error('Error leaving organization:', err.message);
            res.status(500).send('Failed to leave organization');
        } else if (this.changes === 0) {
            res.status(404).send('User was not part of this organization');
        } else {
            res.status(200).json({ message: 'User left organization' });
        }
    });
});


// start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log('Server running on http://localhost:5000/auth/google');
});