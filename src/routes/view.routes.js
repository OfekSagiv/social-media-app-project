const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/', (req, res) => {
    const user = req.session?.user;
    if (user) return res.redirect('/home');
    res.redirect('/login');
});

router.get('/home', isLoggedIn, (req, res) => {
    const user = req.session.user;
    res.render('home', {
        fullName: user.fullName,
        user
    });
});

module.exports = router;
