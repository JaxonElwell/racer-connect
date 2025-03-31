const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config(); // Load environment variables

const router = express.Router();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Serialize user information into session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from session
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Route to start Google OAuth login
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// OAuth callback route
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('http://localhost:5174/dashboard'); // Redirect user to dashboard after successful login
    }
);

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Pass error to global error handler
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/');
        });
    });
});

// Protected route example
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ user: req.user });
});

module.exports = router;
