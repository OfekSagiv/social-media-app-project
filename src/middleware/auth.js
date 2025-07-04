const session = require('express-session');

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    },
});

function isLoggedIn(req, res, next) {
    if (req.session.user) return next();
    res.redirect('/login');
}

function isLoggedOut(req, res, next) {
    if (!req.session.userId) return next();
    res.status(403).json({ message: 'Already logged in' });
}

module.exports = {
    sessionMiddleware,
    isLoggedIn,
    isLoggedOut,
};
