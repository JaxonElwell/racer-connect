const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sqlite3 = require('sqlite3').verbose();
const { google } = require('googleapis'); // ✅ Required for Calendar API
require('dotenv').config();

const router = express.Router();

// SQLite DB connection (same as used in index.js)
const db = new sqlite3.Database('./devdb.sqlite', (err) => {
    if (err) console.error('DB connection error:', err.message);
});

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value;
    const firstName = profile.name?.givenName || '';
    const lastName = profile.name?.familyName || '';
    const picture = profile.photos?.[0]?.value || null;

    db.get('SELECT * FROM Users WHERE email = ?', [email], (err, row) => {
        if (err) return done(err);

        if (row) {
            if (!row.picture && picture) {
                db.run('UPDATE Users SET picture = ? WHERE id = ?', [picture, row.id], (updateErr) => {
                    if (updateErr) {
                        console.error('Failed to update missing profile picture:', updateErr.message);
                        return done(null, { ...row, accessToken }); // fallback with token
                    }

                    db.get('SELECT * FROM Users WHERE id = ?', [row.id], (err, updatedUser) => {
                        if (err) return done(err);
                        return done(null, { ...updatedUser, accessToken }); // ✅ inject token
                    });
                });
            } else {
                return done(null, { ...row, accessToken }); // ✅ inject token
            }
        } else {
            const sql = `INSERT INTO Users (first_name, last_name, email, picture) VALUES (?, ?, ?, ?)`;
            db.run(sql, [firstName, lastName, email, picture], function (err) {
                if (err) return done(err);

                db.get('SELECT * FROM Users WHERE id = ?', [this.lastID], (err, newUser) => {
                    if (err) return done(err);
                    return done(null, { ...newUser, accessToken }); // ✅ inject token
                });
            });
        }
    });
}));

// Session handling
passport.serializeUser((user, done) => {
    done(null, user.id); // Store DB user ID in session
});

passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM Users WHERE id = ?', [id], (err, user) => {
        done(err, user);
    });
});

// Start OAuth flow
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.events']
    })
);

// OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('http://localhost:5173/');
    }
);

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => res.redirect('/'));
    });
});

// Return user profile from session
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ user: req.user });
});

// NEW ROUTE: Add Event to Google Calendar
router.post('/add-google-event', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send('Unauthorized');

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: req.user.accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
        summary: req.body.summary,
        location: req.body.location,
        description: req.body.description,
        start: {
            dateTime: new Date(req.body.start).toISOString(),
            timeZone: 'America/Chicago',
        },
        end: {
            dateTime: new Date(req.body.end).toISOString(),
            timeZone: 'America/Chicago',
        },
    };

    calendar.events.insert({ calendarId: 'primary', resource: event }, (err, result) => {
        if (err) {
            console.error('Google Calendar error:', err);
            return res.status(500).send('Calendar event insertion failed.');
        }
        res.status(200).send('Event added to Google Calendar');
    });
});

module.exports = router;
