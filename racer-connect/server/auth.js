const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sqlite3 = require('sqlite3').verbose();
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
          // 🛠️ Optional: update picture if it's missing in DB
          if (!row.picture && picture) {
            db.run('UPDATE Users SET picture = ? WHERE id = ?', [picture, row.id], (updateErr) => {
              if (updateErr) {
                console.error('Failed to update missing profile picture:', updateErr.message);
                return done(null, row); // fallback to stale user
              }
    
              // ✅ RE-FETCH updated user to ensure session is fresh
              db.get('SELECT * FROM Users WHERE id = ?', [row.id], (err, updatedUser) => {
                if (err) return done(err);
                return done(null, updatedUser); // refreshed session data
              });
            });
          } else {
            return done(null, row); // already has picture
          }
        } else {
          // INSERT new user
          const sql = `INSERT INTO Users (first_name, last_name, email, picture) VALUES (?, ?, ?, ?)`;
          db.run(sql, [firstName, lastName, email, picture], function (err) {
            if (err) return done(err);
    
            db.get('SELECT * FROM Users WHERE id = ?', [this.lastID], (err, newUser) => {
              if (err) return done(err);
              return done(null, newUser);
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
    passport.authenticate('google', { scope: ['profile', 'email'] })
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
    res.json({ user: req.user }); // includes id, name, email from Users table
});

module.exports = router;
