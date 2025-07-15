const session = require('express-session');
const User = require('../models/User');

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    },
});

async function attachUser(req, res, next) {
    if (req.session?.user) {
        try {
            const user = await User.findById(req.session.user._id)
                .populate('following', '_id');

            if (user) {
                req.user = user;

                req.session.user = {
                    _id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    profileImageUrl: user.profileImageUrl,
                    following: user.following.map(f => f._id.toString())
                };
            }
        } catch (err) {
            console.error('Error loading user from session:', err.message);
        }
    }
    next();
}

function isLoggedIn(req, res, next) {
    const isApiRequest = req.originalUrl.startsWith('/api/');


    if (isApiRequest && req.session?.user && !req.user) {
        req.user = req.session.user;
    }

    if (req.user) return next();
    const acceptsJSON = req.headers.accept && req.headers.accept.includes('application/json');


    if (acceptsJSON || isApiRequest || req.xhr) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    res.redirect('/login');
}

function isLoggedOut(req, res, next) {
    if (!req.user && !req.session.user) return next();
    res.status(403).json({message: 'Already logged in'});
}

module.exports = {
    sessionMiddleware,
    isLoggedIn,
    isLoggedOut,
    attachUser,
};
